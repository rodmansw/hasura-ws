import 'regenerator-runtime/runtime'
import {} from 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import chalk from 'chalk'
import passport from 'passport'

import { handleErrorResponse } from './utils'

import authRoutes from './routes/auth'

const app = express()

// check if the secret sent in the header equals to the secret stored as an env variable
function correctSecretProvided(req) {
  const requiredSecret = process.env.ACTION_SECRET
  const providedSecret = req.headers.action_secret
  return requiredSecret === providedSecret
}

// authorize action call
function authorizationMiddleware(req, res, next) {
  if (correctSecretProvided(req)) {
    next()
  } else {
    handleErrorResponse(res, 403, { message: 'Not authorized' })
  }
}

app.set('host', '0.0.0.0')
app.set('port', process.env.API_PORT || 4004)
app.use(bodyParser.json())
app.use(passport.initialize())
app.use(passport.session())
app.use(authorizationMiddleware)

app.use('/auth', authRoutes)

app.post('/', (req, res) => {
  console.log('---EVENT---')
  console.log(req.body)
  console.log('NEW', req.body.event.data.new)
  console.log('---EVENT END---')
  res.status(200).json({
    ...req.body.event.data.new
  })
})

app.get('/', (req, res) => {
  res.status(200).json({
    data: 'API'
  })
})

app.use((err, req, res) => {
  console.error(err.stack)
  handleErrorResponse(res, 500, err)
})

app.listen(app.get('port'), () => {
  console.log(
    '%s 🚀 Server ready at http://localhost:%d in %s mode',
    chalk.green('✓'),
    app.get('port'),
    app.get('env')
  )
  console.log('  Press CTRL-C to stop\n')
})

process.on('uncaughtException', (err) => {
  console.log('Unhandle exception: ', err)
})
