const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const reporterSchema = mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true
        },

        age:{
            type:Number,
            required:true,
            default:25,
            validate(value){
                if(value<0){
                    throw new Error('Age Must Be A Positive Number')
                }
            }
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error('Email Is Invalid')
                }
            }
        },
        password:{
            type:String,
            required:true,
            trim:true,
            lowercase:true,
            minlength:8,
            validate(value){
                if(value.includes('password')){
                    throw new Error('Invalid password! password can\'t contain password word')
                }
            }
        },
        tokens:[{
            token:{
                type:String,
                required:true
            }
        }],
        avatar:{
            type:Buffer
        },
    },
    {
        timestamps:true
    }
)

reporterSchema.pre('save',async function(next){
    const reporter = this
    if(reporter.isModified('password')){
        reporter.password = await bcrypt.hash(reporter.password,8)
    }
    next()
})

reporterSchema.statics.findByCredentials = async(email,password)=>{
    const reporter = await Reporter.findOne({email})
    if(!reporter){
        throw new Error('Email is incorrect')
    }
    const isMatch = await bcrypt.compare(password,reporter.password)
    if(isMatch){
        throw new Error('Password is incorrect')
    }
    return reporter
}

reporterSchema.methods.generateToken = async function(){
    const reporter = this
    const token = jwt.sign({_id:reporter._id.toString()},'my reporters')
    reporter.tokens = reporter.tokens.concat({token})
    await reporter.save()
    return token
}

reporterSchema.methods.toJSON = function(){
    const reporter = this

    const reporterObject = reporter.toObject()
    delete reporterObject.password
    delete reporterObject.tokens

    return reporterObject
}

const Reporter = mongoose.model('Reporter',reporterSchema)

module.exports = Reporter