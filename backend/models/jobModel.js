import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    salary: { type: Number, required: true },
    vacancy: { type: Number, required: true },
    postName: { type: String, required: true },
    isApply:{ type:Boolean,default:false},
    isRemove:{ type:Boolean,default:false}
},
  {
    timestamps: true,
  }
);
const Job = mongoose.model('job', jobSchema);
export default Job;