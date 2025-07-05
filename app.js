const express = require('express')
const morgan = require('morgan')
const blogs = require('./controllers/blogs')

const app = express()

app.use(express.json())
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('tiny'))
}

app.use('/api/blogs', blogs)

module.exports = app