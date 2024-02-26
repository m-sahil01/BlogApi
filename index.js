const express = require("express");
const app= express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const multer = require("multer");
const path = require("path");
const cors = require('cors');


app.use(cors());
dotenv.config();
app.use(express.json());
app.use("https://blogapi-yf21.onrender.com/api/images", express.static(path.join(__dirname, "https://blogapi-yf21.onrender.com/api/images")));

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    connectTimeoutMS: 30000,
    useFindAndModify:true,
}).then(console.log("connected")).catch(err=>console.log(err));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "images");
    },
    filename: (req, file, cb) => {
      cb(null, req.body.name);
    },
  });

const upload = multer({storage:storage});
app.post("https://blogapi-yf21.onrender.com/api/upload", upload.single("file"),(req, res)=>{
    res.status(200).json("file have been uploaded");
})


app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);

app.listen("4000", ()=>{
    console.log("Backend is running");
});