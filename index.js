const express = require("express");
const app =express();
const port =3000;
const db = require('./Config/db.js')
const router = require('./Route/index.js');

const bodyParser = require('body-parser');


app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies


//Setting up cookies
const cookieParser = require("cookie-parser");

//For session cookies
const session =require('express-session');
const passport=require('passport');
const passportLocal =require('./Config/passport_Stratagy');
const MongoStore = require('connect-mongo');

const path = require('path');
// extract style and scripts for layouts
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// set up view engine
app.set('view engine', 'ejs');
app.set('views', './views');


//expression session
app.use(
    session({
      name:'emp_review',
      secret:'raj',
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 1000 * 60 * 100,
      },
      store: new MongoStore({
        mongoUrl:'mongodb://127.0.0.1:27017/employee_review',
        mongooseConnection:db,
        autoRemoval:'disabled'
      },function(err){
        if(err){
        console.log(err,'error in mongostore')}
      })
    })
  );
  
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(passport.setAuthenticatedUser);

// static files

app.use('/static', express.static(path.join(__dirname, 'Asset')));



// express layouts
const expresslayouts= require('express-ejs-layouts');
app.use(expresslayouts);

app.use('/',require('./Route'));

app.listen(port,()=>{
    console.log('app is online on port ',port);

   
})