const nodemailer = require('nodemailer');
const path = require('path');
const ejs = require('ejs');
const env = require('./environment');

// transporter defines the configuration using which I will be sending emails. This is the part which sends email
let transporter = nodemailer.createTransport(env.smtp);

// I'll be sending those emails using template defined below
let renderTemplate = (data, relativePath)=>{
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname,'../views/mailers', relativePath),
        data,
        function(err, template){
            if (err){ console.log('error in rendering template', err);  return; } 
            
            mailHTML = template;
        }
    )
    return mailHTML;
}

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
};