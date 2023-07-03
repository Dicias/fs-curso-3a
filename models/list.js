const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
require('dotenv').config()

const url = process.env.MONGODB_URI
mongoose.connect(url)
  .then(() => {
    console.log('Connected to DB')
  })
  .catch((error) => {
    console.log('Error connecting to DB',error.message)
  })

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, minlength: 3 },
  num: { type: String, required: true, minlength: 8 }
})
contactSchema.plugin(uniqueValidator)

contactSchema.set('toJSON',{
  transform: (document,returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports =mongoose.model('Contact',contactSchema)