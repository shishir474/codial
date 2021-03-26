const fs = require('fs') // since we will be writing in the file system(logging in production) we need to import fs module
const rfs = require('rotating-file-stream');
const path = require('path'); 

// logDirectory defines where the logs will be stored 
const logDirectory = path.join(__dirname,'../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);  // I've to find if production_logs already exists or it needs to be created

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
});

const development = {
    name: 'development',
    asset_path: './assets',
    session_cookie_key: 'blahsomething',
    db: 'codial_production',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth:{
            user: 'codial.cn.21@gmail.com',
            pass: 'codingninjas'
        }
    },
    google_client_ID: "861868532152-k45bt075p0okbe713n8i5u4g5v7r6i8h.apps.googleusercontent.com",
    google_client_Secret: "c10DQgHOYtUVWJZpt8i7F9KD",
    google_callbackURL: "http://codial.com/users/auth/google/callback",
    jwt_secret: 'codial',
    morgan:{
        mode: 'dev',
        options: {stream: accessLogStream}
    }
}

// REFER: https://stackoverflow.com/questions/9249830/how-can-i-set-node-env-production-on-windows  for setting environment variables in process.env.. To check if the variable is successfully set in process.env type node in terminal and  then type process.env.. It will display a process.env object
// REFER random key gen website for generating rondom keys to be used for session_cookie_key and jwt_secret here
// In order to run code in production environment we need to add a script(prod_start) in package.json.. and then run app via npm run prod_start command
const production = {
    name: 'production',
    asset_path: process.env.CODEIAL_ASSET_PATH,
    session_cookie_key: process.env.CODIAL_SESSION_COOKIE_KEY,
    db: process.env.CODIAL_DB,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth:{
            user: process.env.CODIAL_GMAIL_USERNAME,
            pass: process.env.CODIAL_GMAIL_PASSWORD
        }
    },
    google_client_ID: process.env.CODIAL_GOOGLE_ClIENT_ID,
    google_client_Secret: process.env.CODIAL_GOOGLE_CLIENT_SECRET,
    google_callbackURL: process.env.CODIAL_GOOGLE_CALLBACK_URL,
    jwt_secret: process.env.CODIAL_JWT_SECRET,
    morgan:{
        mode: 'combined',
        options: {stream: accessLogStream}
    }
}

// module.exports = development;
module.exports = eval(process.env.CODIAL_ENVIRONMENT)==undefined ? development : eval(process.env.CODIAL_ENVIRONMENT);