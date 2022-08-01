module.exports = (app) => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const UserSchema = new Schema({
    // 学号
    username: {
      type: String,
      required: true,
    },
    // 密码
    password: {
      type: String,
      select: false,
      required: true,
    },
    liked_articles: {
      type: Array,
      default: [],
    },
  })

  return mongoose.model('User', UserSchema)
}
