// NOTE: keep commiting and pushing all your code on gitHub
const express = require('express');
const port = 8000;
const app = express();

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
