
const { test, describe, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const { initialBlogs, nonExistingId, getBlogs } = require('./blogs_test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  await Blog.insertMany(initialBlogs)
})

describe('Blogs api', () => {
  test('get blogs returns correct amount', async() => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('unique identifier is named id', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach(element => {
        assert(element.id)
    });
  })

  test('blog is added succesfully', async () => {
    const newBlog = {
      title: 'New title',
      author: 'New person',
      url: 'newurl',
      likes: 6
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, initialBlogs.length + 1)
  })

  test('blog is removed succesfully', async () => {
    const response = await api.get('/api/blogs')
    const removeId = response.body[0].id

    await api
        .delete(`/api/blogs/${removeId}`)
        .expect(204)
    
    const response1 = await api.get('/api/blogs')

    assert.strictEqual(response1.body.length, initialBlogs.length - 1)
  })

  test('blog is updated succesfully', async () => {
    const response = await api.get('/api/blogs')
    const updateBlog = response.body[0]

    updateBlog.likes = 5

    const putResponse = await api
        .put(`/api/blogs/${updateBlog.id}`)
        .send(updateBlog)
    
    assert.strictEqual(putResponse.body.likes, updateBlog.likes)
  })
})

after(async () => {
    await mongoose.connection.close()
})