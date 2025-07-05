const Blog = require('../models/blog')

const initialBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f1',
      title: 'Some title',
      author: 'Some person',
      url: 'someurl',
      likes: 4,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f2',
      title: 'Some other title',
      author: 'Some other person',
      url: 'someotherurl',
      likes: 6,
      __v: 0
    },
]

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const getBlogs = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = { initialBlogs, nonExistingId, getBlogs }