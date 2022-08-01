const score = require('../model/article')

const Controller = require('egg').Controller

class ArticleController extends Controller {
  // 获取文章列表
  async getArticles() {
    const { Article } = this.app.model
    let { pageNum = 1, pageSize = 8 } = this.ctx.query
    pageNum = Number.parseInt(pageNum)
    pageSize = Number.parseInt(pageSize)
    const Articles = await Article.find()
      .sort({
        updated_time: -1,
      })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)

    this.ctx.body = {
      article_list: Articles,
    }
  }

  // 获取置顶文章列表
  async getTopArticles() {
    const { Article } = this.app.model
    const Articles = await Article.find({
      is_top: 1,
    }).sort({
      updated_time: -1,
    })

    this.ctx.body = {
      article_list: Articles,
    }
  }

  // 更新文章点赞数据
  async updateArticleLike() {
    const { body } = this.ctx.request
    const { Article } = this.app.model
    const { type, articleId } = body

    // 查询数据
    const article = await Article.findById(articleId)

    if (!article) {
      this.ctx.throw(404, 'Article Not Found')
    }

    type == 1 && Object.assign(article, { like: article.like + 1 })
    type == 0 && Object.assign(article, { like: article.like - 1 })

    await article.save()

    // 发送响应
    this.ctx.body = {
      article,
    }
  }

  // 更新文章阅读量数据
  async updateArticleView() {
    const { body } = this.ctx.request
    const { Article } = this.app.model
    const { articleId } = body

    // 查询数据
    const article = await Article.findById(articleId)

    if (!article) {
      this.ctx.throw(404, 'Article Not Found')
    }

    Object.assign(article, { view: article.view + 1 })

    await article.save()

    // 发送响应
    this.ctx.body = {
      article,
    }
  }

  // 获取文章详情
  async getArticle() {
    const { Article } = this.app.model
    const { articleId } = this.ctx.params

    const article = await Article.findById(articleId)

    // 文章未找到
    if (!article) {
      this.ctx.throw(404)
    }

    Object.assign(article, { view: article.view + 1 })

    await article.save()

    this.ctx.body = {
      articleData: article,
    }
  }

  async deleteArticle() {
    const { Article } = this.app.model
    const { articleId } = this.ctx.params
    const article = await Article.findById(articleId)

    // 标签
    if (!article) {
      this.ctx.throw(404)
    }

    // 作者不是当前登录用户
    if (!article.user.equals(this.ctx.user._id)) {
      this.ctx.throw(403)
    }

    if (article.article_count === 0) {
      await article.remove()
      this.ctx.status = 204
    } else {
      this.ctx.throw(422, '该标签下存在文章，删除失败！')
    }
  }

  async createArticle() {
    const body = this.ctx.request.body
    const { Article } = this.app.model
    // 数据验证
    this.ctx.validate(
      {
        title: { type: 'string' },
        type: { type: 'number' },
        tags: { type: 'array' },
        img: { type: 'string' },
        content: { type: 'string' },
      },
      body
    )
    const title = body.title
    const article = await Article.findOne({ title })

    if (!article) {
      // 创建文章
      const article = await new Article({
        user: this.ctx.user._id,
        title: body.title,
        type: body.type,
        tags: body.tags,
        is_top: 0,
        img: body.img,
        content: body.content,
        created_time: Date.now(),
        updated_time: Date.now(),
      }).save()
      this.ctx.body = {
        article,
      }
    } else {
      this.ctx.throw(422, '该标题已存在！')
    }
  }

  async updateArticle() {
    const { body } = this.ctx.request
    const { Article } = this.app.model
    const { measureId } = this.ctx.params
    const studentId = this.ctx.student._id
    // 基本数据验证
    this.ctx.validate({
      ideology: { type: 'number', required: false },
      academic: { type: 'number', required: false },
      development: { type: 'number', required: false },
    })

    // 查询数据
    const article = await Article.findById(measureId)

    if (!article) {
      this.ctx.throw(404, 'Article Not Found')
    }

    if (!article.student.equals(studentId)) {
      this.ctx.throw(403)
    }

    Object.assign(
      article,
      this.ctx.helper._.pick(body, ['ideology', 'academic', 'development'])
    )

    await article.save()

    // 发送响应
    this.ctx.body = {
      article,
    }
  }
}

module.exports = ArticleController
