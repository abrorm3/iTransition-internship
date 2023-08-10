const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./authRouter');
const PORT = process.env.PORT || 3000
const uri = "mongodb+srv://abrormukhammadiev:789654123Abror@clustertask4.jnix1cj.mongodb.net/?retryWrites=true&w=majority"

const app = express();

app.use(express.json());
app.use("/auth", authRouter);

const start  = async() => {
    try{
        await mongoose.connect(uri)
        app.listen(PORT, ()=>{
            console.log(`server started on port ${PORT}`)
        })
    }catch(e){
        console.log(e);
    }
}
start();