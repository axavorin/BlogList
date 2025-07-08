const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const userRoute = require('express').Router()
const User = require('../models/user')

userRoute.get('/', async (request, response) => {
  const users = await User.find({})
                            .populate('blogs')

  response.json(users)
})

userRoute.post('/', async (request, response) => {
  const user = new User(request.body)
  user.password = await bcrypt.hash(user.password, 10)

  const result = await user.save()

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response.status(200).json({ token, username: user.username, name: user.name })
})

module.exports = userRoute