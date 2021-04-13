const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const path = require('path')
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

// mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);
// mongoose.set('useUnifiedTopology', true);
mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB is connected'))
    .catch(error => console.log(error))

app.use(passport.initialize())
require('./middleware/passport')(passport)

app.use(require('morgan')('dev'))
app.use('/uploads', express.static('uploads')) // it gives direct access to pictures
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(require('cors')())

app.use('/api/auth', authRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/position', positionRoutes)

// Готовим сервер к деплою
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/dist/client'))

    app.get('*', (req, res) => {
        res.sendFile(
            path.resolve(
                __dirname, 'client', 'dist', 'client', 'index.html'
            )
        )
    })
}
// Готовим сервер к деплою end

module.exports = app

//npm i nodemon
//npm run server - run server
//npm install body-parser - download package for parsing data in postman
//npm install cors morgan
//npm i mongoose

// in mongoDb fullstack username: tanya, password: 2hPozSWemopmmYgj
//mongo "mongodb+srv://cluster0.48cwp.mongodb.net/myFirstDatabase" --username tanya


// in mongoDb MEAN DB username: tatyana, password: opdc13QVUWkKditb
//mongo "mongodb+srv://cluster0.lu1mx.mongodb.net/myFirstDatabase" --username tatyana

//npm i bcryptjs - for password encoding
//npm install jsonwebtoken

//npm install passport passport-jwt

//npm install multer moment - for file uploading
