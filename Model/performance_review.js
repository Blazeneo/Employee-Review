const mongoose = require('mongoose');
const performaceReviewSchema = new mongoose.Schema({
   name:{
    type: String,
        required: true

   },
    email: {
        type: String,
        required: true
    },
   reviewer:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Employee'
    
   },reviewerName:{
    type:String,
    required: true

   },
   rating:{
    type:Number
   },completed:{
    type:String,
    enum:['Yes','No'],
    default:'No'
   }
});




const Review = mongoose.model('Review', performaceReviewSchema);


module.exports = {
  
    Review: Review
};