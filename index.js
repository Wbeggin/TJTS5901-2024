const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const { ok } = require('assert')
app.use(cors())
app.use(express.json())


app.get('/api/', (request, response) => {
    response.json({ message: 'Hello World' })
  })

const PORT = 8080
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
