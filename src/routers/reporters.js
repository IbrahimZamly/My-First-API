const express = require('express')
const router = new express.Router()
const Reporter = require('../models/reporters')
const auth = require('../middleware/auth')
const multer = require('multer')

/* Start Post Reporters With Token*/
router.post('/reporters',async (req,res)=>{
    const reporter = new Reporter(req.body)
    try{
        await reporter.save()
        const token = await reporter.generateToken()
        res.status(201).send({reporter,token})
    }catch(e){
        res.status(500).send('here'+e)
    }
})
/* End Post Reporters With Token*/

/* Start Get All Reporters */
router.get('/reporters',auth,(req,res)=>{
    Reporter.find({}).then((reporters)=>{
        res.status(200).send(reporters)
    }).catch((e)=>{
        res.status(500).send(e)
    })
})
/* End Get All Reporters */

/* Start Get One Reporter by ID*/
router.get('/reporters/:id',(req,res)=>{
    const _id = req.params.id
    Reporter.findById(_id).then((reporter)=>{
        if(!reporter){
            return res.status(404).send('unable to find reporter')
        }
        res.status(200).send(reporter)
    }).catch((e)=>{
        res.status(500).send('Connection Error ' + e)
    })
})
/* End Get One Reporter by ID*/


/* Start Get by id first then update*/
router.patch('/reporters/:id',async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','password']
    let isValid = updates.every((update)=>allowedUpdates.includes(update))

    if(!isValid){
        return res.status(400).send('Can Not Update')
    }

    const _id = req.params.id
    try{
        const reporter = await Reporter.findById(_id)
        updates.forEach((update)=>(reporter[update] = req.body[update]))
        await reporter.save()
        if(!reporter){
            return res.status(400).send('No Reporter Is Found')
        }
        return res.status(200).send(reporter)
    }catch(e){
        res.status(400).send('Connenction Error')
    }
})
/* End Get by id first then update*/


/* Start Update Using Auth */
router.patch('/profile',auth,async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','password']
    const isValid = updates.every((update)=>allowedUpdates.includes(update))
    if(!isValid){
        return res.status(400).send('Can Not Update')
    }
    try{
        updates.forEach((update)=>(req.reporter[update] = req.body[update]))
        await req.reporter.save()
        res.status(200).send(req.reporter)
    }catch(e){
        res.status(400).send(e)
    }
})
/* End Update Using Auth */

/* Start Delete Reporter */
router.delete('/reporters/:id',async (req,res)=>{
    const _id = req.params.id

    try{
        const reporter = await Reporter.findByIdAndDelete(_id)
        if(!reporter){
           return res.status(400).send('No Reporters Found')
        }
        res.status(200).send(reporter)
    }catch(e){
        res.send(e)
    }
})
/* End Delete Reporter */


/* Start Login with token */
router.post('/reporters/login',async(req,res)=>{
    try{
        const reporter = await Reporter.findByCredentials(req.body.email,req.body.password)
        const token = await reporter.generateToken()
        res.send({reporter,token})
    }catch(e){
        res.send('Error has occured' + e)
    }
})

router.get('/profile',auth,async(req,res)=>{
    res.send(req.reporter)
})
/* End Login with token */

/* Start Logout */
router.post('/logout',auth,async(req,res)=>{
    try{
        req.reporter.tokens = req.reporter.tokens.filter((el)=>{
             return el.token !== req.token
        })
        await req.reporter.save()
        res.send('Logout Successfully')
    }catch(e){
        res.status(500).send('Please Login')
    }
})
/* End Logout */


/* Start Logout All*/
router.post('/logoutAll',auth,async(req,res)=>{
    try{
        req.reporter.tokens = []
        await req.reporter.save()
        res.send(' Logout All...')
    }catch(e){
        res.send('Please Login')
    }
})
/* End Logout All*/


/* Start Delete Profile */
router.delete('/profile',auth,async (req,res)=>{


    try{
        await req.reporter.remove()
        res.send('Deleted')
    }catch(e){
        res.send(e)
    }
})
/* End Delete Profile */


/* Start Upload Image */
const uploads = multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)){
            return cb(new Error('Please Upload An Image'))
        }
        cb(undefined,true)
    }
})

router.post('/profile/avatar',auth,uploads.single('avatar'),async(req,res)=>{
    try{
        req.reporter.avatar = req.file.buffer
        await req.reporter.save()
        res.send("Your Photo Is Uploaded...")
    }catch(e){
        res.send(e)
    }
})
/* End Upload Image */
module.exports=router