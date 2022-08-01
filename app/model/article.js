module.exports = (app) => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const ArticleSchema = new Schema({
    // 所属用户
    user: {
      type: mongoose.ObjectId,
      ref: 'User',
      required: true,
    },
    // 标题
    title: {
      type: String,
      required: true,
    },
    type: {
      type: Number,
      enum: [1, 2],
      required: true,
    },
    is_top: {
      type: Number,
      enum: [0, 1],
      required: true,
    },
    tags: {
      type: Array,
      required: true,
      default: [],
    },
    img: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    view: {
      type: Number,
      required: true,
      default: 0,
    },
    comment_count: {
      type: Number,
      required: true,
      default: 0,
    },
    like: {
      type: Number,
      required: true,
      default: 0,
    },
    created_time: {
      type: Date,
      default: Date.now,
    },
    updated_time: {
      type: Date,
      default: Date.now,
    },
    article_count: {
      type: Number,
      required: true,
      default: 0,
    },
  })

  return mongoose.model('Article', ArticleSchema)
}
