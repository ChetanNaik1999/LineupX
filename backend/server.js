import express from "express";
import mongoose from 'mongoose';
import bcrypt from "bcryptjs";
import User from "./models/userModel.js";
import dotenv from "dotenv";


const app=express();
app.use(express.json());
app.use(express.urlencoded({ extended:true }));
dotenv.config({ path: './config.env'});
const port=process.env.PORT || 5000;
import cors from "cors";
import generateToken from "./utils.js";
import Job from "./models/jobModel.js";

const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions));

mongoose.connect("mongodb://localhost/deliverymanagement" || process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>{
  console.log("Conneted");
}).catch((error)=>{
   console.log(error);
});

app.get('/getorders',(req,res) =>{
        res.send({data});   
});

app.post('/login',async(req,res)=>{
  const user=await User.findOne({email:req.body.email});
  if(user){
    if(bcrypt.compareSync(req.body.password,user.password)){
      res.send({
        _id:user._id,
        name:user.name,
       email:user.email,
       isEmployer:user.isEmployer,
       isClient:user.isClient,
       token:generateToken(user)
      });
      return;
    }
  }
  res.status(401).send({message:"Invalid email or password"});
});

app.post('/register',async(req,res)=>{
    const user = new User({
        name:req.body.name,
        email:req.body.email,
        password: bcrypt.hashSync(req.body.password,8)
    });
   const createdUser=await user.save();
   res.send({
       _id:createdUser._id,
        name:createdUser.name,
       email:createdUser.email,
       isEmployer:createdUser.isEmployer,
       isClient:createdUser.isClient,
       token:generateToken(createdUser)
   })
});


app.post('/jobs',async(req,res) =>{
  const jobs=new Job({
    name:req.body.name,
    salary:req.body.salary,
    vacancy:req.body.vacancy,
    postName:req.body.postName
});

  const user=await jobs.save();
  res.send({
    _id:user._id,
     name:user.name,
    salary:user.salary,
    vacancy:user.vacancy,
    postName:user.postName,
  })
});


app.get('/getjobs',async(req,res) =>{
   const jobs =await Job.find({});
   res.status(200).send({jobs});    
});


app.put('/apply/:id',async(req,res) =>{
  const applyJob=await Job.findByIdAndUpdate(req.params.id);
  applyJob.isApply=true;
  applyJob.isRemove=false;
  await applyJob.save();
  res.status(200).send({ status:"Congratulations! Succesfully Apply for This Job",success:true});
});

app.put('/addtoclient/:id',async(req,res) =>{
  const applyJob=await Job.findByIdAndUpdate(req.params.id);
  applyJob.isApply=false;
  applyJob.isRemove=false;
  await applyJob.save();
  res.status(200).send({ status:"Congratulations! Your Job is Added To Client PORTAL",success:true});
});

app.put('/remove/:id',async(req,res)=>{
  const applyJob=await Job.findByIdAndUpdate(req.params.id);
  applyJob.isApply=false;
  applyJob.isRemove=true;
  await applyJob.save();
  res.status(200).send({ status:"Congratulations! Your Job is Succesfull Removed From Client PORTAL",success:true});
});

if(process.env.NODE_ENV === "production"){
  app.use(express.static("deliverymanagementsystem/build"));
}
app.listen(port,()=>{
    console.log(`Server At http://localhost:${port}`);
})