module.exports = (app) => {
  const { router, controller } = app
  const auth = app.middleware.auth()
  router
    .prefix('/api') // 设置基础路径
    .post('/create', controller.user.create)
    .post('/login', controller.user.login)
    .get('/tags', controller.tag.getTags)
    .delete('/tags/:tagId', auth, controller.tag.deleteTag) // 删除
    .post('/tags', auth, controller.tag.createTag) // 创建
    .post('/article', auth, controller.article.createArticle) // 创建
    .get('/articles', controller.article.getArticles) // 获取文章列表
    .get('/articles_top', controller.article.getTopArticles) // 获取置顶文章列表
    .put('/article/like', controller.article.updateArticleLike) // 更新文章点赞信息
    .put('/article/view', controller.article.updateArticleView) // 更新文章点赞信息
    .get('/article/:articleId', controller.article.getArticle) // 获取文章详情
}
