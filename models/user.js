const { MONGODB_URI } = require('../utils/config')

const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  username: {
        type: String,
        unique: true,
        required: true
    },
  name: String,
  password: String,
  blogs: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    }
  ]
})

userSchema.set('toJSON',  {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.password
  }
})

const User = mongoose.model('User', userSchema)

mongoose.connect(MONGODB_URI)

module.exports = User