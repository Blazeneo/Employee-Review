const express =require('express');
const router =express.Router();
const passport = require('passport');
const userController = require('../Controller/user_controller');

const admController =require('../Controller/admin_controller');





passport.checkAuthentication = function(req,res,next){
    if(req.isAuthenticated()){
       
      return next();

    }
    return res.redirect('/');
  }
  router.get('/',userController.sigin);
router.get('/home',passport.checkAuthentication,userController.home);


router.get('/signup',userController.signup);

// use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'emp-user',
    {failureRedirect: '/'},
), userController.session);

router.get('/admin/sigin',(req,res)=>{

    res.render('admin_sigin');

});


router.post('/users/create',userController.create);
router.get('/users/feedback/:id',passport.checkAuthentication,userController.feedback);
router.post('/users/rating/submit/:id',passport.checkAuthentication,userController.submitRating);

//admin routes
router.get('/admin/home',passport.checkAuthentication,admController.home);
router.get('/admin/sigin',admController.sigin);

router.post('/users/admin/create-session',passport.authenticate('adm-user',{ failureRedirect: '/admin/sigin'}),admController.session)


router.get('/users/admin/delete/:id',passport.checkAuthentication,admController.delete);

router.get('/users/admin/create-admin/:id',passport.checkAuthentication,admController.create);
router.get('/users/admin/performance',passport.checkAuthentication,admController.review);

router.get('/users/logout',admController.logout);

router.post('/users/admin/addemp/rating',passport.checkAuthentication,admController.addreview);

router.post('/users/admin/update/rating',passport.checkAuthentication,admController.updateRating);

router.post('/users/admin/update/reviewer',passport.checkAuthentication,admController.updateReviewer);


module.exports =router;