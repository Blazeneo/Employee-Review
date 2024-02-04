const mongoose = require('mongoose');

const {Employee} = require('../Model/user');
const { Review } = require('../Model/performance_review');




module.exports.sigin= async function(req,res){

    console.log('sigini controller loaded');
        return res.render('sigin',{title:"sigin"});
    }

    module.exports.signup= async function(req,res){

        console.log('sigup controller loaded');
            return res.render('signup',{title:"sigup"});
        }


module.exports.create =function(req,res){
    console.log('sigin');
   console.log(req.body);
if(req.body.password != req.body.confirm_password){
    console.log('password 3doesnt match');
    
    return res.redirect('back');
}
Employee.findOne({email: req.body.email}).then(
    function(user){
        if(!user){
            Employee.create(req.body).then(
                function(user){
                   console.log('user created');
                    return res.redirect('/');
                }
            ).catch(
                function(err){
                    if(err){
                        console.log('error in crteating the user while signing up',err); 
                        
                        return res.status(400).json({ error: 'Validation Error', messages: err});
                    }
                }
            )
        }
        else{
            console.log('user is there');
            return res.redirect('/');
        
        }
        
        
        }
).catch(
   
       function(err){
        
            console.log('error in creating user',err);
            return res.redirect('back');
        
       }
    
    );


};


module.exports.session= async function(req,res){
    

    console.log('session controller loaded');
        return res.redirect('/home');
    }

    module.exports.home= async function(req,res){
        

        const rating =  []

        const review = await Review.find({});
        // console.log(review);

        review.forEach((rev)=>{
            if(rev.reviewer == req.user.id && rev.completed =='No'){

                rating.push(rev);
                

            }

        });

        
            return res.render('home',{title:'home',performance:rating,mode:'users'});
        }

       


module.exports.feedback = async (req,res)=>{

    const review = await Review.findById(req.params.id);
    return res.render('feedback',{review:review,mode:'users'});
}

module.exports.submitRating = async (req,res)=>{

    const review = await Review.findById(req.params.id);

    

    var rating = (parseInt(req.body.Productivity) + parseInt(req.body.Competency) + parseInt(req.body.Communication) + parseInt(req.body.ProblemSolving)) / 4;
   await review.updateOne({rating:rating});
   await review.updateOne({completed:'Yes'});

    return res.redirect('/home');
}