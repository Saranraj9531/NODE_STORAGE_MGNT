const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Store = require('../models/store')
const User = require('../models/user')
const multer = require('multer')
// const upload = multer({dest:'uploads/'})



/**
 * GET Method used to Get the store details
 */

const storage = multer.diskStorage({ 
    destination: function(req, file, cb){
        cb(null,'./uploads/')
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
    }
})
    // const fileFilter = (req, file, cb)=>{
    //     //  reject a file

    //     if(file.mimetype === 'image/type' || file.mimetype === 'image/png'){
    //         cb(null, true)

    //     } else{
    //         cb(null, false)
    //     }
    // }


const upload = multer({storage: storage,limits:{fileSize: 1024*1024*5}})
router.get('/',(req, res, next)=>{
    Store.find().populate('user_id', 'name').exec().then( docs=>{
        res.status(200).json({
            status : true,
            code: 200,
            data: docs
        })
    }).catch( err=>{
        res.status(500).json({error: err})
    })
})



/**
 * POST Method used to create the store details
 */


router.post('/',upload.single('storeImage'),(req, res, next)=>{
    console.log(req.file)
    User.findById(req.body.user_id)
    .exec()
    .then( (user)=>{
        // if(!user){
        //     return res.status(404).json({message: "Product Not found"})
        // }

        const store = new Store({
            name: req.body.name,
            user_id: req.body.user_id,
            status: req.body.status,
            storeImage: req.file.path
        })
        return store.save()
    }).then( (result)=>{
        console.log(result)
        res.status(201).json({
            status: true,
            status_code: 201,
            data: result
        })
    })
    .catch( (err)=>{
        console.log(err)
        res.status(500).json({ error: err})
    }  )
    
}) 

/**
 * GET Method used to Get the store details individually
 */
router.get('/:storeId',(req, res, next)=>{
   Store.findById(req.params.storeId)
   .exec()
   .then(store=>{
       res.status(200).json({
           status: true,
           status_code: 200,
           store: store
       })
   })
   .catch(err=>{
       res.status(500).json({error: err})
   })
})


/**
 * POST Method used to toggle the store state
 */

router.post('/status/:storeId', (req, res, next)=>{
    // const id = req.params.storeId
    // Store.updateOne({_id: id}, { $set: req.body}).exec().then( results=>{
    //     res.status(200).json({status: true, data: results })
    // } ).catch( err=>{
    //     res.status(500).json({ error: err})
    // })
    const id = req.params.storeId
        const users = Store.findById(id)
    .exec().then(store=>{
        if(store.status === true)
        {
            Store.updateMany({_id: id}, {$set: {status: false}}).exec().then( result=>{
              return  res.status(200).json({
                    status_code: 200,
                    data: result
                })
            })
            console.log(store.status)
        } else {
            Store.updateMany({_id: id}, {$set: {status: true}}).exec().then( result=>{
               return res.status(200).json({
                    status_code: 200,
                    data: result
                })
            })
        }
    }).catch( err=>{
        res.status(500).json({ error: err })
    })    
    })


    /**
 * PATCH Method used to Update the store details
 */


router.patch('/:storeId',(req, res, next)=>{
    const id = req.params.storeId
Store.updateMany({_id: id}, {$set: req.body}).exec().then(results=>{
    res.status(200).json({ status: true,
    data: results })
}).catch( err =>{
    res.status(500).json({error: err})
})
})

router.delete('/:storeId',(req, res, next)=>{
Store.remove({_id: req.params.storeId}).exec().then(result=>{
    res.status(200).json({message: 'Store Details Deleted', status_code: 200, data: result})
}).catch(err=>{
    res.status(500).json({error: err})
}    )
})

module.exports = router