// NOTE: keep commiting and pushing all your code on gitHub
const express = require('express');
const port = 8000;
const app = express();
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const db = require('./config/mongoose');
const User = require('./models/User');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo')(session);
var sassMiddleware = require('node-sass-middleware');

app.use(sassMiddleware({
   src: './assets/scss',
   dest: './assets/css',
   debug: true,
   outputStyle: 'extended',
   prefix: '/css' // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>

}));




// look for the static files in the assets folder
app.use(express.static('./assets'));

// inserts the form data in req.body as key-value pairs where key is the name of the input and value is the value given as an input by the user
app.use(express.urlencoded());

// telling my app to use the cookie parser so that I can access/alter it
app.use(cookieParser());

// all the views that are going to be rendered belongs to some sort of a layout.That's why we need to tell our app
app.use(expressLayouts);

// extract style and scripts from subpages into the layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

//set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// This middleware encrypts the session cookie
app.use(session({
    name: 'codial',
    secret: 'blahsomething',
    saveUninitialized: false, // don't create session until something stored
    resave: false, //don't save session if unmodified
    cookie:{
        maxAge: (1000 * 60 * 1000) // in ms
    },
    // mongo store is used to store the session cookie in the database
    store: new MongoStore({
        mongooseConnection: db,
        autoRemove: 'disabled'
    },function(err){
        console.log(err || 'connect mongo-db set up ok');
    })
}));

app.use(passport.initialize());
app.use(passport.session());

// for settng user in res.locals
app.use(passport.setAuthenticatedUser);

// use express router
app.use('/',require('./routes'));
/*For any type of request it requires routes indes.js.So we mapped to it */


app.listen(port,function(err){
    if (err){
        console.log(`error ${err}`);
        return ;
    }
    console.log(`server is running on port: ${port}`);
})
