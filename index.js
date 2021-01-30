// NOTE: keep commiting and pushing all your code on gitHub
const express = require('express');
const port = 8000;
const app = express();
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const db = require('./config/mongoose');
const User = require('./models/User');

// look for the static files in the assets folder
app.use(express.static('./assets'));

app.use(express.urlencoded());

// telling my app to use the cookie parser so that I can access/alter it
app.use(cookieParser());

// all the views that are going to be rendered belongs to some sort of a layout.That's why we need to tell our app
app.use(expressLayouts);

// extract style and scripts from subpages into the layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

// use express router
app.use('/',require('./routes'));
/*For any type of request it requires routes indes.js.So we mapped to it */

//set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.listen(port,function(err){
    if (err){
        console.log(`error ${err}`);
        return ;
    }
    console.log(`server is running on port: ${port}`);
})
