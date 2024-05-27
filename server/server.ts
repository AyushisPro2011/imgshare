import express from "express"
import cors from "cors"

const app = express()
const port:number = 8080;


app.use(cors())
app.get("/",(req,res)=>{
    res.send("This is a Test")
})
app.get("/create",(req,res)=>{
    res.send("Create")
})
app.get("/read",(req,res)=>{
    res.send("Read")
})
app.get("/update",(req,res)=>{
    res.send("Update")
})
app.get("/delete",(req,res)=>{
    res.send("Delete")
})


app.listen(port , ()=>{
    console.log(`Server started on port ${port}`);
})