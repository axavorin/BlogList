const testingRoute = require('express').Router()
const User = require('../models/user')
const Blog =  require('../models/blog')

testingRoute.post('/reset', async (request, response) => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  response.status(200).end()
})

module.exports = testingRoute