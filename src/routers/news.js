const express = require('express')
const router = new express.Router()
const News = require('../models/news')
const auth = require('../middleware/auth')

/* Start Post News*/
router.post('/news',auth,async(req,res)=>{
    const news = new News({...req.body,owner:req.reporter._id})

    try{
        await news.save()
        res.status(200).send(news)
    }catch(e){
        res.status(400).send(e)
    }
})
/* End Post News*/

/* Start Get All News */
router.get('/news',auth,async(req,res)=>{
    try{
        const news = await News.find({owner:req.reporter._id})
        res.send(news)
    }catch(e){
        res.status(500).send(e)
    }
})
/* End Get All News */

/* Start Get News By ID*/
router.get('/news/:id',auth,async(req,res)=>{
    const _id = req.params.id
    try{
        const news = await News.findOne({_id,owner:req.reporter._id})
        if(!news){
            return res.status(400).send('No News Found')
        }
        res.send(news)
    }catch(e){
        res.status(500).send(e)
    }
})
/* End Get News By ID*/

/* Start Edit News By ID*/
router.patch('/news/:id',auth,async(req,res)=>{
    const updates = Object.keys(req.body)
    try{
        const _id =req.params.id
        const news = await News.findOne({_id,owner:req.reporter._id})
        if(!news){
            return res.status(400).send('No News Found')
        }
        updates.forEach((update)=> news[update] = req.body[update])
        await news.save()
        res.send(news)
    }catch(e){
        res.send(e)
    }
})
/* End Edit News By ID*/

/* Start Delete News By ID*/
router.delete('/news/:id',auth,async(req,res)=>{
    try{
        _id=req.params.id
        const news = await News.findOneAndDelete({_id,owner:req.reporter._id})
        if(!news){
            return res.status(400).send('No News Found')
        }
        res.send('Deleted')
    }catch(e){
        res.status(500).send(e)
    }
})
/* End Delete News By ID*/

module.exports = router