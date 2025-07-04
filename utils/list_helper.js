const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
    const totalFunc = (sum, blog) => sum + blog.likes
    return blogs.length === 0 
        ? 0 
        : blogs.reduce(totalFunc, 0)
}

module.exports = {
  dummy, totalLikes
}