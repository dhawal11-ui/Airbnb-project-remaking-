const express = require("express");
const app = express(); 
const mongoose = require("mongoose");


const MONGO_URl = "mongodb://127.0.0.1:27017/test";
async function main() { // making main function
   await mongoose.connect(MONGO_URl);
}

main().then(()=>{ // calling main function
    console.log("connected to db")
}).catch(()=>{
    console.log(err);
})

app.get("/", (req,res)=>{
    res.send("hi Root");
});

app.listen(8080,()=>{
    console.log("server is on 8080")
});
