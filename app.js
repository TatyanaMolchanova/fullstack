const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
// const cors = require('cors')
// const morgan = require('morgan')
const authRoutes = require('./routes/auth')
const analyticsRoutes = require('./routes/analytics')
const categoryRoutes = require('./routes/category')
const orderRoutes = require('./routes/order')
const positionRoutes = require('./routes/position')
const keys = require('./config/keys')
const app = express()

// mongoose.connect(keys.mongoURI, { useNewUrlParser: true,  useUnifiedTopology: true })
mongoose.connect(keys.mongoURI)
    .then(() => console.log('MongoDB is connected'))
    .catch(error => console.log(error))

app.use(require('morgan')('dev'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(require('cors')())

app.use('/api/auth', authRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/position', positionRoutes)


module.exports = app

//npm i nodemon
//npm run server - run server
//npm install body-parser - download package for parsing data in postman
//npm install cors morgan
//npm i mongoose

// in mongoDb MEAN DB username: tatyana, password: opdc13QVUWkKditb
//mongo "mongodb+srv://cluster0.lu1mx.mongodb.net/myFirstDatabase" --username tatyana
