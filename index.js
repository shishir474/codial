// NOTE: keep commiting and pushing all your code on gitHub
const express = require('express');
const port = 8000;
const app = express();

// USING LAYOUTS TO RENDER VIEWS
const expressLayouts = require('express-ejs-layouts');

const cookieParser = require('cookie-parser');

// REQUIRE DB COLLECTION
const db = require('./config/mongoose');

// REQUIRE SCHEMA
const User = require('./models/User');

const session = require('express-session');

// AUTHENTCATION USING PASSPORT
const passport = require('passport');

// USING LOCAL STRATEGY FOR AUTHENTICATION
const passportLocal = require('./config/passport-local-strategy');

// TO SAVE SESSION COOKIE IN DB
const MongoStore = require('connect-mongo')(session);

// using sass Middleware package to use sass
const sassMiddleware = require('node-sass-middleware');

// these are the settings that I need to put for using SASS.I put this just before the server starts bcoz I need these files to be precompiled which are then served to the browser
// Browser only understands CSS. at compilation these SASS files get converted to CSS files
app.use(sassMiddleware({
   src: './assets/scss',
   dest: './assets/css',
   debug: true, // do I need to display errors that are in the files during compilation.Yes obviously so Set to true. SEt to false if in production mode
   outputStyle: 'extended', // do I want everything to be in a single line.NO obviously. We want it to e in multiple lines so extended
   prefix: '/css' // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
   //  prefix specifies where my server should look out for CSS files.. In /css folder
}));




// look for the static files in the assets folder
app.use(express.static('./assets'));

// inserts the form data in req.body as key-value pairs where key is the name of the input and value is the value given as an input by the user
app.use(express.urlencoded());

// telling my app to use the cookie parser so that I can access/alter COOKIE
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
