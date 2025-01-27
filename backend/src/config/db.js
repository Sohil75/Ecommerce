const mongoose = require("mongoose")

const mongoDbUrl='mongodb+srv://mdsohil1802:Sohil7524@cluster0.hhrtk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const connectDb=()=>{
    return mongoose.connect(mongoDbUrl)
}

module.exports={connectDb}