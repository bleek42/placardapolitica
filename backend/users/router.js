const express = require('express')
const path = require('path')
const UsersService = require('./service')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
  .post('/', jsonBodyParser, (req, res, next) => {
    const { password, user_name, full_name, nickname } = req.body

    for (const field of ['full_name', 'user_name', 'password'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        })

    // TODO: check user_name doesn't start with spaces
    const trimmedFields = ['password', 'user_name'];
    const nonTrimmedField = trimmedFields.find(field => {
      req.body[field].trim() !== req.body[field]
    });
      if (nonTrimmedField) {
        return res.status(422).json({
          code:422,
          reason: 'Validation Error',
          message: 'Cannot start or end with a whitespace',
          location: nonTrimmedField
        });
      }

    const passwordError = UsersService.validatePassword(password)

    if (passwordError)
      return res.status(400).json({ error: passwordError })

    UsersService.hasUserWithUserName(
      user_name
    )
      .then(hasUserWithUserName => {
        if (hasUserWithUserName)
          return res.status(400).json({ error: `Username already taken` })

        return UsersService.hashPassword(password)
          .then(hashedPassword => {
            const newUser = {
              user_name,
              password: hashedPassword,
              full_name,
              nickname
            }

            return UsersService.insertUser(
              newUser
            )
              .then(user => {
                res
                  .status(201)
                  .location(path.posix.join(req.originalUrl, `/${user.id}`))
                  .json(UsersService.serializeUser(user))
              })
          })
      })
      .catch(next)
  })

module.exports = usersRouter