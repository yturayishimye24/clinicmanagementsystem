export const Verify = (req,res)=>{
return res.status(200).json({success:true,user:req.user})
}