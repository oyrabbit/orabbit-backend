const Serive = require('egg').Service
const jwt = require('jsonwebtoken')

class UserService extends Serive {
  get User() {
    return this.app.model.User
  }
  findByUsername(username) {
    return this.User.findOne({
      username,
    }).select('+password')
  }
  async createUser(data) {
    data.password = this.ctx.helper.md5(data.password)
    const user = new this.User(data)
    await user.save() // 保存到数据库中
    return user
  }
  createToken(data) {
    const token = jwt.sign(data, this.app.config.jwt.secret, {
      expiresIn: this.app.config.jwt.expiresIn,
    })
    return token
  }
  verifyToken(token) {
    return jwt.verify(token, this.app.config.jwt.secret)
  }
}
module.exports = UserService
