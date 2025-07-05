const blogRoute = require('express').Router()
const Blog = require('../models/blog')

blogRoute.get('/', async (request, response) => {
  const blogs = await Blog.find({})

  response.json(blogs)
})

blogRoute.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  const result = await blog.save()

  response.status(201).json(result)
})

blogRoute.delete('/:id', async (request, response) => {
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