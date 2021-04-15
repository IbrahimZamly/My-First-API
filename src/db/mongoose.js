const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/news-api',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true,
    useFindAndModify:false
})

