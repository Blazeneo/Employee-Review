const mongoose = require('mongoose');

const {Admin} = require('../Model/user');

const {Employee} = require('../Model/user');
const {Review} = require('../Model/performance_review');

//create ADM user
module.exports.create = async function(req, res) {
    try {
        // Find the employee by ID
        const newAdmin = await Employee.findById(req.params.id);

        // Check if the employee exists
        if (!newAdmin) {
            console.log('Employee not found');
            return res.status(404).json({ error: 'Employee not found' });
        }

        // Check if an admin user with the same email already exists
        const existingAdmin = await Admin.findOne({ email: newAdmin.email });

        if (!existingAdmin) {
            // Create a new admin user
            const adminUser = await Admin.create({
                name: newAdmin.name,
                email: newAdmin.email,
                password: newAdmin.password
            });
            console.log('Admin user created:', adminUser);
        } else {
            
        
        console.log('Admin user already exists');
        }

        // Update the employee to mark them as an admin
        await Employee.updateOne({ _id: req.params.id }, { role: 'admin' });

        // Redirect to a success page or send a response
        return res.redirect('back');
    } catch (error) {
        // Handle errors
        console.error('Error creating admin user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

//*********** */

module.exports.sigin=async (req,res)=>{
    
    console.log('adm controller loaded');
        return res.render('admin_sigin',{title:'sigin',mode:'Admin'});
}



    module.exports.session= async function(req,res){

        console.log('admin session controller loaded');
            return res.redirect('/admin/home');
        }


        
module.exports.home=async (req,res)=>{

    const employees = await Employee.find({})


    
   
        return res.render('admin',{title:"adm_home",users:employees,mode:'Admin'});
}


//delete user by admin
module.exports.delete = async (req,res)=>{

    const emp = await Employee.findById(req.params.id);
    
    await Review.deleteOne({email:emp.email}).then((user)=>{
        console.log('user deleted');
       })


   await Employee.deleteOne({_id:req.params.id}).then((user)=>{
    console.log('user deleted',user);
   })

   
   return res.redirect('back');


}

//logout admin-session

module.exports.logout = async (req,res,next)=>{
    

    req.logout(function(err) {
        if (err) { 
            console.log(err);
            return next(err); }
       
      });
    return res.redirect('/');
 
 
 }

 module.exports.review = async (req, res) => {
    try {
        const employees = await Employee.find({}); 
        const reviews = await Review.find({}); 
        return res.render('performance', { employees: employees,performance: reviews, title: 'Performance Review',mode:'Admin' });
    } catch (error) {
        console.error('Error fetching performance reviews:', error);
        
        return res.status(500).send('Internal Server Error');
    }
};

module.exports.addreview = async (req, res) => {
    try {
        // Find the employee by ID
        const emp = await Employee.findById(req.body.id);
        const reviewer = await Employee.findById(req.body.Reviewer);


        if (req.body.id===req.body.Reviewer) {
            console.log('reviewer is not valid' );
            return res.status(404).json({ error: 'reviewer is not valid'});
        }
        // Check if the employee exists
        if (!emp) {
            console.log('Employee not found');
            return res.status(404).json({ error: 'Employee not found' });
        }
        console.log(req.body);
        if (!reviewer) {
            console.log('reviewer not found');
            return res.status(404).json({ error: 'Employee not found' });
        }
       

        // Check if an  user with the same email already exists for rating
        const newReview =await Review.find({email:emp.email});

        if (newReview!=[]) {
            
            const userRating = await Review.create({
                name: emp.name,
                email: emp.email,
                reviewer: reviewer._id,
                reviewerName:reviewer.name,
            });
            console.log(' user created:');
        } else {
            
        
        console.log('user already exists');
        }

        

        // Redirect to a success page or send a response
        return res.redirect('back');
    } catch (error) {
        // Handle errors
        console.error('Error creating user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports.updateRating =async (req,res)=>{

    const review = await Review.findById(req.body.id);

   await review.updateOne({rating:req.body.rating}).then((done)=>{
    if(done)
    console.log('rating updated');
    
   });

    return res.redirect('back');

}

module.exports.updateReviewer =async (req,res)=>{

    const review = await Review.findById(req.body.id);
    const reviewer = await Employee.findById(req.body.reviewer);
    if(review.email==reviewer.email){
        console.log(' user cannot be same');
        return res.status(500).json({ error: 'Internal server error' });
    }

   await review.updateOne({reviewer:reviewer._id,reviewerName:reviewer.name}).then((done)=>{
    if(done)
    console.log(' updated');
    
   });

    return res.redirect('back');

}

