import bcrypt from 'bcrypt'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'

import prisma from './db'

passport.use(
  new LocalStrategy(
    {
      usernameField: 'input[email]',
      passwordField: 'input[password]'
    },
    async (email, password, done) => {
      try {
        const user = await prisma.users.findOne({ where: { email } })

        if (!user) return done(new Error('User not found'))

        bcrypt.compare(password, user.password, (err, passwordCorrect) => {
          if (err) return done(err)
          if (!passwordCorrect) return done(new Error('Invalid password'))
          return done(null, user)
        })
      } catch (error) {
        return done(error)
      }
    }
  )
)

export default passport
