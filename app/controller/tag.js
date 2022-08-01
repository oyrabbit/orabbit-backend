const score = require('../model/tag')

const Controller = require('egg').Controller

class TagController extends Controller {
  async getTags() {
    const { Tag } = this.app.model
    // const filterDoc = {
    //   user: this.ctx.user._id,
    // }
    const Tags = await Tag.find()

    this.ctx.body = {
      tag_list: Tags,
    }
  }

  async deleteTag() {
    const { Tag } = this.app.model
    const { tagId } = this.ctx.params
    const tag = await Tag.findById(tagId)

    // 标签
    if (!tag) {
      this.ctx.throw(404)
    }

    // 作者不是当前登录用户
    if (!tag.user.equals(this.ctx.user._id)) {
      this.ctx.throw(403)
    }

    if (tag.article_count === 0) {
      await tag.remove()
      this.ctx.status = 204
    } else {
      this.ctx.throw(422, '该标签下存在文章，删除失败！')
    }
  }

  async createTag() {
    const body = this.ctx.request.body
    const { Tag } = this.app.model
    // 数据验证
    this.ctx.validate(
      {
        name: { type: 'string' },
      },
      body
    )
    const name = body.name
    const tag = await Tag.findOne({ name })

    if (!tag) {
      // 创建标签
      const tags = await new Tag({
        name: body.name,
        user: this.ctx.user._id,
        // article_list: [],
        // article_count: 0,
      }).save()
      this.ctx.body = {
        tags,
      }
    } else {
      this.ctx.throw(422, '该标签已存在！')
    }
  }

  async updateTag() {
    const { body } = this.ctx.request
    const { Tag } = this.app.model
    const { measureId } = this.ctx.params
    const studentId = this.ctx.student._id
    // 基本数据验证
    this.ctx.validate({
      ideology: { type: 'number', required: false },
      academic: { type: 'number', required: false },
      development: { type: 'number', required: false },
    })

    // 查询数据
    const tag = await Tag.findById(measureId)

    if (!tag) {
      this.ctx.throw(404, 'Tag Not Found')
    }

    if (!tag.student.equals(studentId)) {
      this.ctx.throw(403)
    }

    Object.assign(
      tag,
      this.ctx.helper._.pick(body, ['ideology', 'academic', 'development'])
    )

    await tag.save()

    // 发送响应
    this.ctx.body = {
      tag,
    }
  }
}

module.exports = TagController
