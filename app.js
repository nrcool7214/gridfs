const express= require("express")
const app=express()
const mongoose=require("mongoose")
const fs= require("fs")
const Image= require("./model/imageSchema")
const multer = require("multer")
const {setCors}= require("./security") 
const formData = require('express-form-data')
const cors=require("cors")

/* app.use(setCors) */
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))

/* const storage = multer.diskStorage({
    destination:"uploads/",
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()+"."+file.originalname.split(".")[1])
    }
  })
   
  const upload = multer({ storage: storage }) */
   const storage= multer.diskStorage({
      destination:"uploads/",
      filename:function(req,file,cb){
          cb(null,file.fieldname+"."+file.originalname.split(".")[1])
      }

  })

  const upload =multer({storage:storage}) 


mongoose.connect(" mongodb://127.0.0.1:27017/imagesaver",{ useNewUrlParser: true,useUnifiedTopology: true },()=>console.log("db connected"))




app.post("/upload",upload.single("file"),async(req,res)=>{
/*     console.log(req.body)
    console.log("working")
    console.log(req.file)
    let data= fs.readFileSync(__dirname+"/"+req.file.path)
    console.log(data.toString("base64")) */
    /* const encode_image = data.toString('base64'); */
    // Define a JSONobject for the image attributes for saving to database
      
    console.log(req.file)
    const finalImg = {
         type: req.file.mimetype,
         image: Buffer.from(req.file.toString("base64")) /* new Buffer(encode_image, 'base64') */
      };
      const saveImage= new Image({
          file:finalImg
      })
      await saveImage.save()

      const images= await Image.find();
      console.log(images[0])
      res.contentType("image/png")
      res.send({url:images[0].file.image.buffer})



})

app.get("/image",async(req,res)=>{
    const images= await Image.find();
    console.log(images[0])
    res.contentType("image/png")
    res.send({url:images[0].name.image.buffer})
})

app.listen(3001,()=>console.log("server running on port 3000"))