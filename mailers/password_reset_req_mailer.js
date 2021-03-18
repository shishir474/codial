const nodemailer = require('../config/nodemailer');

// This funciton will send an email to the user who created a comment
exports.newPasswordMail = (user) => {
    console.log('inside password change mailer');
   // console.log(comment);   

    let htmlString = nodemailer.renderTemplate({user: user}, '/password_reset/change_password.ejs')
    nodemailer.transporter.sendMail({
        from: 'codial.cn.21@gmail.com',
        to:user.email,
        subject: "Request for password change",
        html: htmlString   // rendering via template
        // html: '<h1>Yup, your comment is now published!</h1>'
    }, (err, info) => {
        if (err){console.log('error in sending message', err); return}

        console.log('Message Sent', info);
        return;
    })
}

exports.changePassword = (user) => {
    console.log('inside password change mailer');
   // console.log(comment);   

    let htmlString = nodemailer.renderTemplate({user: user}, '/password_reset/password_updated.ejs')
    nodemailer.transporter.sendMail({
        from: 'codial.cn.21@gmail.com',
        to:user.email,
        subject: "Password changed",
        html: htmlString   // rendering via template
        // html: '<h1>Yup, your comment is now published!</h1>'
    }, (err, info) => {
        if (err){console.log('error in sending message', err); return}

        console.log('Message Sent', info);
        return;
    })
}
