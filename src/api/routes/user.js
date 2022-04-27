const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const router = express.Router()
const User = require('../models/user')
const Store = require('../models/store')
const { route } = require('./store')
const jwt = require('jsonwebtoken')

/**
 * GET Method used to Get the User details
 */
router.get('/',(req, res, next)=>{
  User.find().exec().then((docs=>{
    console.log(docs)
    res.status(200).json({status: true,
            data: docs})
  })).catch(  (err)=>{
    console.log(err)
    res.status(500).json({
        error:err
    })
  } )
})


/**
 * POST Method used to create the user 
 */
router.post('/',(req, res, next)=>{
User.findOne({email: req.body.email})
.exec()
.then(user=>{
    if(user){
         return res.status(409).json({ message: 'Mail exists'})

    } else
    {
        bcrypt.hash(req.body.password, 10, (err, hash)=>{
            if(err){
                return res.status(500).json({
                    error: err
                })
            } else {
                const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    name: req.body.name,
                    email: req.body.email,
                    password: hash,
                    ph_no: req.body.ph_no
                    
                }) 
                user.save()
                .then(result=>{
                    console.log(result)
                    res.status(200).json({
                        status: true,
                        message:'User Created Successfully',
                        createdUser: user
                    })
                })
                .catch(err=>{console.log(err)
                        res.status(500).json({
                            error: err
                        })
                })
            }
        }) 
        }
})
})



/**
 * POST Method used to login the user 
 */
router.post('/login', (req, res, next)  =>{
    User.find({email: req.body.email}).exec().then( user=>{
            if(user.length <1){
                return res.status(401).json({
                    message: 'Auth Failed'
                })
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result)=>{

                if(err){
                    return res.status(401).json({
                        message: 'Auth Failed'
                    })
                } 
                if (result)
                {

                 const token = jwt.sign({ email: user[0].email,
                                userId:user[0]._id
                    }, 'Key_for_JWT', {
                        expiresIn: '1h'
                    })
                    return  res.status(200).json({
                        message: 'Auth Successful',
                        token: token
                    })
                }

                res.status(401).json({
                    message: 'Auth Failed'
                })

            })
    }).catch(  err=>{
        res.status(500).json({
            err: error
        })
    })
})

   
/**
 * GET Method used to Get the user details individually
 */
router.get('/:userId',(req, res, next)=>{
    const id = req.params.userId
    User.findById(id)
    .exec()
    .then(doc=>{
    if(doc){
        console.log(doc)
        res.status(200).json(doc)
    } else {
        res.status(404).json({message: 'No valid entry found'})
    }
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({error:err})
    })
})

/**
 * PATCH Method used to update the user details
 */
router.patch('/:userId',(req, res, next)=>{
    const id = req.params.userId
    // const updateOps = {}
    // for (const ops of req.body){
    //     updateOps[ops.propName]= ops.value
    // }
    User.updateMany({_id:id}, {$set: req.body})
    .exec()
    .then(result=>{
        console.log(result)
        res.status(200).json( )
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({ error: err})
    })
})

/**
 * DELETE Method used to Delete the user 
 */
router.delete('/:userId',(req, res, next)=>{
    const id = req.params.userId
    User.remove({_id:id})
    .exec()
    .then((result)=>{
        res.status(200).json(result)
    })
    .catch((err)=>{
        console.log(err)
        res.status(500).json({error: err})
    })
})
 
module.exports = router