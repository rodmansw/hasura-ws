import express from 'express'
import { check, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import passport from '../config/passport'
import prisma from '../config/db'

import { handleErrorResponse, handleResponse } from '../utils'

const authRoutes = express.Router()

function createToken(user) {
  const tokenContents = {
    sub: user.id,
    email: user.email,
    iat: Date.now() / 1000,
    'https://hasura.io/jwt/claims': {
      'x-hasura-allowed-roles': ['user', 'public'],
      'x-hasura-user-id': user.id,
      'x-hasura-default-role': 'user',
      'x-hasura-role': 'user'
    }
  }

  return jwt.sign(tokenContents, process.env.ENCRYPTION_KEY)
}

authRoutes.post(
  '/login',
  [
    check('input.password', 'Password field is required').not().isEmpty(),
    check('input.email', 'Email field is required').not().isEmpty(),
    check('input.email', 'Email is not valid').isEmail()
  ],
  async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return handleErrorResponse(res, 422, errors.array())
    }

    passport.authenticate('local', async (err, user) => {
      if (err) return handleErrorResponse(res, 404, err)

      try {
        if (user) {
          const dataUser = { ...user }
          delete dataUser.password

          return handleResponse(res, 200, {
            userId: user.id,
            accessToken: createToken(user)
          })
        }
      } catch (error) {
        return handleErrorResponse(res, 409, error)
      }
    })(req, res, next)
  }
)

authRoutes.post(
  '/signup',
  [
    check('input.data.name', 'Name field is required').not().isEmpty(),
    check('input.data.surname', 'Surname field is required').not().isEmpty(),
    check('input.data.email', 'Email field is required').not().isEmpty(),
    check('input.data.email', 'Email is not valid').isEmail(),
    check('input.data.password', 'Password field is required').not().isEmpty(),
    check('input.data.password', 'Password must be at least 5 characters long').isLength({ min: 5 })
  ],
  async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return handleErrorResponse(res, 422, errors.array())
    }

    try {
      const salt = bcrypt.genSaltSync()
      req.body.input = { ...req.body.input.data }
      const data = req.body.input
      const password = await bcrypt.hash(data.password, salt)

      await prisma.users.create({
        data: { ...data, password }
      })

      passport.authenticate('local', async (err, user) => {
        if (err) return handleErrorResponse(res, 400, err)

        try {
          if (user) {
            const dataUser = { ...user }
            delete dataUser.password

            return handleResponse(res, 200, {
              userId: user.id,
              accessToken: createToken(user)
            })
          }
        } catch (error) {
          return handleErrorResponse(res, 409, error)
        }
      })(req, res, next)
    } catch (error) {
      return handleErrorResponse(res, 409, error)
    }
  }
)

module.exports = authRoutes
