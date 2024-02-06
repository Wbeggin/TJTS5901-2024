const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const { ok } = require('assert')

app.get('/api/', (request, response) => {
    response.json(ok)
  })

  const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})