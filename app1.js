const express = require("express")
const app = express()
const mongoose = require("mongoose")

const cors = require("cors")
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const url = 'mongodb://localhost:27017/gridfs';
const Grid = require('gridfs-stream');
/* app.use(setCors) */
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Mongo URI
const mongoURI = 'mongodb://localhost:27017/gridfs';

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

// Init gfs
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = file.originalname;
      const fileInfo = {
        filename: filename,
        bucketName: 'uploads'
      };
      resolve(fileInfo);
    });
  }
});

const upload = multer({ storage })

app.post("/upload", upload.single("file"), (req, res) => {
  console.log(req.file)
  res.redirect(`/image/${req.file.filename}`)
})

app.get("/image/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {

    res.contentType("image/png")
    const readstream = gfs.createReadStream(file.filename);
    console.log(file)
    readstream.pipe(res);

    /*    res.send(file) */
  })
  /*  console.log(files)
   res.contentType("image/png")
   res.send({files}) */
})


app.listen(3001, () => console.log("server running on 3001"))