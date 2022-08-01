const user = require('../model/user')

const Controller = require('egg').Controller

class UserController extends Controller {
  async create() {
    // 1. 数据校验
    const body = this.ctx.request.body
    this.ctx.validate({
      username: { type: 'string' },
      password: { type: 'string' },
    })

    const userService = this.service.user

    if (await userService.findByUsername(body.username)) {
      this.ctx.throw(422, 'Validation Failed', {
        errors: [
          {
            code: 'invalid',
            field: 'username',
            message: 'has already exists',
          },
        ],
      })
    }

    // 2. 保存用户
    const user = await userService.createUser(body)

    // 3. 生成 token
    const token = userService.createToken({
      userId: user._id,
    })

    // 4. 发送响应
    this.ctx.body = {
      user: {
        username: user.username,
        token,
      },
    }
  }
  async login() {
    const body = this.ctx.request.body
    // 基本数据验证
    this.ctx.validate(
      {
        username: { type: 'string' },
        password: { type: 'string' },
      },
      body
    )
    // 校验学号是否存在
    const userService = this.service.user
    const user = await userService.findByUsername(body.username)

    if (!user) {
      this.ctx.throw(422, '该用户不存在！')
    }

    // 校验密码是否正确
    if (this.ctx.helper.md5(body.password) !== user.password) {
      this.ctx.throw(422, '密码错误！', {
        errors: [
          {
            code: 'invalid',
            field: 'password',
            message: 'incorrect',
          },
        ],
      })
    }
    // 生成token
    const token = userService.createToken({
      userId: user._id,
    })
    // 发送响应数据
    this.ctx.body = {
      user: {
        token,
        username: user.name,
      },
    }
  }
  async getCurrentUser() {
    // 1. 验证 token
    // 2. 获取用户
    // 3. 发送响应
    const user = this.ctx.user
    this.ctx.body = {
      user: {
        token: this.ctx.header.authorization,
        username: user.username,
      },
    }
  }
}

module.exports = UserController
