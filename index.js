// NOTE: keep commiting and pushing all your code on gitHub
 // REFER : https://masteringjs.io/tutorials/mongoose/populate to know more about populate
 // https://medium.com/@nicknauert/mongooses-model-populate-b844ae6d1ee7
const express = require('express');
const port = 8000;
const app = express();
require('./config/view-helpers')(app);
const env = require('./config/environment');
const logger  = require('morgan');

// USING LAYOUTS TO RENDER VIEWS
const expressLayouts = require('express-ejs-layouts');

const cookieParser = require('cookie-parser');

// REQUIRE DB COLLECTION
const db = require('./config/mongoose');

// REQUIRE SCHEMA
const User = require('./models/User');

// once the user establishes identity(i.e. logged in) that identity is saved in session cookie using express session 
const session = require('express-session');

// AUTHENTCATION USING PASSPORT
const passport = require('passport');

// USING LOCAL STRATEGY FOR AUTHENTICATION
const passportLocal = require('./config/passport-local-strategy');

const passportJWT = require('./config/passport-jwt-strategy');

const passportGoogle = require('./config/passport-google-oauth2-strategy');
const crypo = require('crypto');

// TO SAVE SESSION COOKIE IN DB
const MongoStore = require('connect-mongo')(session);

// using sass Middleware package to use sass
const sassMiddleware = require('node-sass-middleware');

// connect-flash used for notifications
const flash = require('connect-flash');
const customMware = require('./config/middleware');  // customware used for setting flash messages in res.locals(so that it can be accessed in templates) from req object

// set up the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is running on port 5000');
const path = require('path');

// these are the settings that I need to put for using SASS.I put this just before the server starts bcoz I need these files to be precompiled which are then served to the browser
// Browser only understands CSS. at compilation these SASS files get converted to CSS files
if (env.name == 'development'){
   
    app.use(sassMiddleware({
        src: path.join(__dirname, env.asset_path, 'scss') ,  // './assets/scss' path.join(__dirname, env.asset_path, 'scss')
        dest: path.join(__dirname, env.asset_path, 'css') ,// './assets/css' path.join(__dirname, env.asset_path, 'css')
        debug: true, // do I need to display errors that are in the files during compilation.Yes obviously so Set to true. SEt to false if in production mode
        outputStyle: 'extended', // do I want everything to be in a single line.NO obviously. We want it to e in multiple lines so extended
        prefix: '/css' // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
        //  prefix specifies where my server should look out for CSS files.. In /css folder
     }));
     
}


// look for the static files in the assets folder
app.use(express.static(env.asset_path));

// linking codial->uploads folder with my index.js/centralized file so that it is accessible using express.static(), __dirname returns the pathe of the current directory
app.use('/uploads', express.static(__dirname + '/uploads')); // make the uplaod`s path availbale to the browser

app.use(logger(env.morgan.mode, env.morgan.options));

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
    secret: env.session_cookie_key,
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

//  initialise passport module
app.use(passport.initialize());
// passport.session() alters 'user' value that is currently the ssession id into the true deserialized user object
//app.use(passport.session()) is equivalent to app.use(passport.authenticate('session')
app.use(passport.session());

// for settng user in res.locals
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);

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


// 