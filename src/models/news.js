const mongoose = require('mongoose')

const newsSchema = mongoose.Schema(
    {
        title:{
            type:String,
            trim:true
        },
        description:{
            type:String,
            trim:true
        },
        owner:{
            type: mongoose.Schema.Types.ObjectId,
            required:true
        },
    },
    {
        timestamps:true
    }
)

const News = mongoose.model('News',newsSchema)

module.exports = News
