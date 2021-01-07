const bcrypt = require('bcryptjs')
const xss = require('xss')
const { User } = require('./models');
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UsersService = {
  hasUserWithUserName(user_name) {
    return User
      .findOne({ user_name })
      .then(user => !!user)
  },
  insertUser(newUser) {
    return User
      .create(newUser)
  },
  validatePassword(password) {
    if (password.length < 8) {
      return 'Password be longer than 8 characters'
    }
    if (password.length > 72) {
      return 'Password be less than 72 characters'
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces'
    }
    // if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
    //   return 'Password must contain one upper case, lower case, number and special character'
    // }
    return null
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12)
  },
  serializeUser(user) {
    return {
      id: user.id,
      full_name: xss(user.full_name),
      user_name: xss(user.user_name),
      nickname: xss(user.nick_name),
      date_created: new Date(user.date_created),
    }
  },
}

module.exports = UsersService