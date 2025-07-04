require('./utils/config')
const express = require('express')
const morgan = require('morgan')
const blogs = require('./controllers/blogs')
const logger = require('./utils/logger')

const app = express()

app.use(express.json())
app.use(morgan('tiny'))

app.use('/api/blogs', blogs)

const PORT = process.env.PORT
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})