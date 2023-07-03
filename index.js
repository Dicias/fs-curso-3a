// Desc: Backend for phonebook app
const express = require('express')
const app = express()
app.use(express.json())
//uso de env
require('dotenv').config()
//cors para transferencia entre dominios
const cors = require('cors')
app.use(cors())
//importar modulo del modelo
const Contact = require('./models/list')
//para usar el build de react
app.use(express.static('public'))
//morgan para ver los request
var morgan = require('morgan')
const { default: mongoose } = require('mongoose')
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':url :method :body' ))


const requestLogger = (request,response,next) => {
  console.log('Method:' , request.method)
  console.log('Path: ' ,request.path)
  console.log('Body: ' ,request.body)
  console.log('---')
  next()
}
app.use(requestLogger)

const url = process.env.MONGODB_URI
mongoose.connect(url)

app.get('/',(request, response) => {
  const date = new Date
  response.send(`<p>El index no funka</p>
    <p> ${date}</p> `)
})

app.get('/api/persons',(request, response) => {
  Contact.find({}).then(Contact => {
    response.json(Contact)
  })
})

app.get('/info', (request,response) => {
  Contact.find({}).then(Contact => {
    response.send(`<p>Phonebook has info for ${Contact.length} people</p>
    <p> ${new Date}</p> `)
  })

})

app.get('/api/persons/:id', (request, response) => {
  Contact.findById(request.params.id)
    .then(note => {
      if(note){
        response.json(note)
      }else{
        response.status(404).end()
      }
    }).catch(error => {
      console.log(error)
      response.status(404).end()
    })
})

app.delete('/api/persons/:id', (request, response) => {
  Contact.findByIdAndDelete(request.params.id)
    .then(contact => {
      response.json(contact)
    }).catch(error => {
      console.log(error)
      response.json(500).end()
    })
})

//// test ////
/*
app.get('/api/persons/test/:id', (request, response)=>{
    const theId = generateId()
    response.json(theId)
})


const generateId = () =>{
    const genId = Math.random() * (500 - 100) + 100
    const newId = Math.floor(genId)
    return newId
}
*/
/*
const sameName = (name) =>{
    const same = persons.find(person => person.name === name)
    return same

}
*/
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const people = new Contact ({
    name: body.name,
    num: body.num
  })
  people.save()
    .then(newContact => newContact.toJSON())
    .then(newFormattedContact => {
      response.json(newFormattedContact)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const contact = {
    name: body.name,
    num: body.num
  }

  Contact.findByIdAndUpdate(request.params.id, contact,{ new: true } )
    .then(updateContact => {
      response.json(updateContact)
    }).catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error,request, response, next) => {
  console.error(error)
  if(error.name === 'CastError'){
    return response.status(400).send({ error: 'malformatted id' })
  }else if(error.name === 'ValidationError'){
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
} )
