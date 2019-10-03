const express=require("express")
const multer=require("multer")


const app=express();

const fileFilter=function(req,file,cb){
    const allowedTypes=["image/jpeg","image/png"]

    if(!allowedTypes.includes(file.mimetype)){
        const error= new Error("Wrong File Type")
        error.code="LIMIT_FILE_TYPES"
        return cb(error,false)
    }

    cb(null,true) //callback
}

const MAX_SIZE=1024*200

//middleware
const upload=multer({
    dest:'./uploads',
    fileFilter,
    limits:{
        fileSize:MAX_SIZE
    }
})

app.post('/upload',upload.single('photo'), (req,resp)=>{
    resp.json({file:req.file})
});

app.post('/multiple',upload.array('files'), (req,resp)=>{
    resp.json({files:req.files})
});

app.use(function(err,req,resp,next) {
    if(err.code==="LIMIT_FILE_TYPES"){
        resp.status(422).json({error:"Only image files are allowed"})
        return;
    }

    if(err.code==="LIMIT_FILE_SIZE"){
        resp.status(422).json({error:`Too large. Max size is ${MAX_SIZE/1024}KB`}) //200 KB
        return;
    }

});

app.listen('3344', console.log("Running on localhost:3344"));
