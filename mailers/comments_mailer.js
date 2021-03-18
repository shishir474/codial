const nodemailer = require('../config/nodemailer');

// This funciton will send an email to the user who created a comment
exports.newCommentMail = (comment) => {
    console.log('inside newCommment mailer');
   // console.log(comment);   

    let htmlString = nodemailer.renderTemplate({comment: comment}, '/comments/new_comments.ejs')
    nodemailer.transporter.sendMail({
        from: 'codial.cn.21@gmail.com',
        to: comment.user.email,
        subject: "New Comment Published",
        html: htmlString   // rendering via template
        // html: '<h1>Yup, your comment is now published!</h1>'
    }, (err, info) => {
        if (err){console.log('error in sending message', err); return}

        console.log('Message Sent', info);
        return;
    })
}