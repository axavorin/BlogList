const express = require('express')
const morgan = require('morgan')
const logger = require('./utils/logger')
const blogs = require('./controllers/blogs')
const users = require('./controllers/users')
const login = require('./controllers/login')

const app = express()

app.use(express.json())
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('tiny'))
}

app.use('/api/blogs', blogs)
app.use('/api/users', users)
app.use('/login', login)

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({
      error: 'expected `username` to be unique'
    })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }

  next(error)
}

app.use(errorHandler)

module.exports = app