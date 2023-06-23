// Desc: Backend for phonebook app
const express = require('express')
const app = express()
app.use(express.json())
const cors = require('cors')
app.use(cors())
var morgan = require('morgan')
morgan.token('body', (req)=>JSON.stringify(req.body)) 
app.use(morgan(':url :method :body' ))



const requestLogger = (request,response,next) =>{
    console.log('Method:' , request.method)
    console.log('Path: ' ,request.path)
    console.log('Body: ' ,request.body)
    console.log('---')
    next()
}
app.use(requestLogger)

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        num: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        num: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        num: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        num: "39-23-6423122"
    }
]

app.get('/',(request, response)=>{
    response.send('<h1>Morgan</h1>')
})

app.get('/api/persons',(request, response)=>{
    response.json(persons)
})

app.get('/info', (request,response)=>{
    const date = new Date
    response.send(`<p>Phonebook has info for ${persons.length}</p>
    <p> ${date}</p> `)
})

app.get('/api/persons/:id', (request, response)=>{
const id = Number(request.params.id)
//console.log(typeof id)
const person = persons.find(person => person.id === id)
//console.log(person, 'desde person')
if(person){
    response.json(person)
}else{
    response.status(404).end()
}
})

app.delete('/api/persons/:id', (request, response)=>{
    const id = Number(request.params.id)
    const newPersons = persons.filter(person => person.id !== id)
    persons = newPersons
    response.status(204).end()
})

//// test ////
app.get('/api/persons/test/:id', (request, response)=>{
    const theId = generateId()
    response.json(theId)
})


const generateId = () =>{
    const genId = Math.random() * (500 - 100) + 100
    const newId = Math.floor(genId)
    return newId
}

const sameName = (name) =>{
    const same = persons.find(person => person.name === name)
    return same
    
}

app.post('/api/persons', (request, response)=>{
const body = request.body
//console.log(sameName(body.name));

if(!body.name){
    return response.status(400).json({
        error: 'name missing'                
    })
}else if(!body.num){
    return response.status(400).json({
        error: 'num missing'
    })
}else if(sameName(body.name)){
    return response.status(400).json({
        error: 'name must be unique'
    })
}

const newPerson ={
    id:generateId(),
    name: body.name,
    num: body.num
}
persons = persons.concat(newPerson)
response.json(newPerson)
})

const unknownEndpoint = (request, response) =>{
    response.status(404).send({error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)    
} )
