const jwt = require('jsonwebtoken')
const Reporter = require('../models/reporters')
const auth = async (req,res,next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ','')

        const decode = jwt.verify(token,'my reporters')

        const reporter = await Reporter.findOne({_id:decode._id,'tokens.token':token})

        if(!reporter){
            throw new Error('Error Has Occurred')
        }

        req.reporter = reporter
        
        next()

    }catch(e){
        res.status(401).send('Please Authenticate')
    }
}
module.exports = auth