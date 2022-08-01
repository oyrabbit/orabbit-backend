module.exports = (app) => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const TagSchema = new Schema({
    // 所属用户
    user: {
      type: mongoose.ObjectId,
      ref: 'User',
      required: true,
    },
    // 名称
    name: {
      type: String,
      required: true,
    },
    articles: {
      type: Array,
      required: true,
      default: [],
    },
    article_count: {
      type: Number,
      required: true,
      default: 0,
    },
  })

  return mongoose.model('Tag', TagSchema)
}
