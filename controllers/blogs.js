const jwt = require('jsonwebtoken')
const blogRoute = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

blogRoute.get('/', async (request, response) => {
  const blogs = await Blog.find({})
                          .populate('creator')

  response.json(blogs)
})

blogRoute.get('/:id', async (request, response) => {
  const blogs = await Blog.findById(request.params.id)
                          .populate('creator')

  response.json(blogs)
})

blogRoute.post('/', async (request, response) => {
  console.log(getTokenFrom(request))
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)
  if (!user) {
    return response.status(401).json({ error: 'token invalid' })
  }
  
  const blog = new Blog({...request.body, creator: user._id})
  user.blogs = user.blogs.concat(blog._id)
  await user.save()

  const result = await blog.save()

  response.status(201).json(result)
})

blogRoute.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const blog = await Blog.findById(request.params.id)
  
  if (blog.creator != decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)

  user.blogs = user.blogs.filter(element => element !== blog._id)
  await user.save()

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogRoute.put('/:id', async (request,  response) => {
  const { title, author, url, likes } = request.body

  const blog = await Blog.findById(request.params.id)

  blog.title = title
  blog.author = author
  blog.url = url
  blog.likes = likes

  const updatedBlog = await blog.save()

  response.json(updatedBlog)
})

module.exports = blogRoute