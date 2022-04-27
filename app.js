const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const productRoutes = require('./src/api/routes/user')
const storeRoutes = require('./src/api/routes/store')

app.use(morgan('dev'))
app.use( '/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({extended: false}))
app.use( bodyParser.json())

mongoose.connect('mongodb://127.0.0.1:27017/store-management', {
    useNewUrlParser: true}).then((res)=>{
        console.log('Mongodb connected succesfully').catch((err)=>{
            console.log('err', err)
        })
    })

app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "*")
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-with, Content-Type, Accpet, Authorization"
    ) 
    if(req.method==='OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next()
})


app.use('/users', productRoutes)
app.use('/stores', storeRoutes)


app.get('/',(req, res)=>{
    res.json({msg: 'Hai'})
})


app.use((req, res, next)=>{
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use( (error, req, res, next)=>{
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
} )



module.exports = app;