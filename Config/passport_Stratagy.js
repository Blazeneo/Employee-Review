const passport = require('passport');


const LocalStrategy= require("passport-local").Strategy;

const {Employee} = require('../Model/user');

const {Admin} = require('../Model/user');

passport.use('emp-user',new LocalStrategy({usernameField:'email'}, function(email,password,done){
  Employee.findOne({ email: email }).then(function(user){
        if (!user || user.password != password){
          console.log('Invalid Username/Password',user);
          return done(null, false);
      }
      return done(null, user);
      }).catch((err)=>{
        console.log('Error in finding user --> Passport');
                return done(err);
      });
}))
passport.use('adm-user', new LocalStrategy({ usernameField: 'email' }, async function (email, password, done) {
  try {
      const user = await Admin.findOne({ email: email });

      if (!user || user.password !== password) {
          console.log('Invalid adm Username/Password for email:',user);
          return done(null, false);
      }

      console.log(' user --> Passport');
      return done(null, user);
  } catch (err) {
      console.log('Error in finding user --> Passport');
      return done(err);
  }
}));
// //serilizing the to which key to be kept in cookies
// passport.serializeUser(function(user,done){
//     done(null,user.id);
//   })

//   //deserilizing the user from the key in the cookies

//   passport.deserializeUser(function(id,done){
//     Employee.findById(id).then(function(user){
       
//         return done(null,user);
//     }
    
//     ).catch((err)=>{
      
//         console.log("error in deserialize",err);
//         return done(err);

    
//     })
//   })

passport.serializeUser(function (user, done) {
  // Serialize user data to store in the session
 
  done(null, { id: user.id, type: user.constructor.modelName });
  
});

passport.deserializeUser(function (serializedUser, done) {
  const { id, type } = serializedUser;

 

  // Deserialize user based on the type
  if (type === 'Employee') {
      Employee.findById(id).then( function ( user) {
          done(null, user);
      });
  } else if (type === 'Admin') {
      Admin.findById(id).then( function ( admin) {
          done(null, admin);
      });
  } else {
      done(new Error('Invalid user type'));
  }
});

  passport.checkAuthentication = function(req,res,next){
    if(req.isAuthenticated()){
      return next();

    }
    return res.redirect('/users/sigin');
  }

  passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){

      res.locals.user = req.user;
      

    }
    return next();

  }