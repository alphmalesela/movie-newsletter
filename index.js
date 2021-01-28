"use strict";
const express = require('express');
const exphbs  = require('express-handlebars');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const publicPath = path.join(__dirname, './views');
const { config } = require('./config');
const Database = require('./database');
const UserRepository = require('./repositories/user');
const Mailer = require('./mailer');
const cron = require('node-cron');
const { genVerifCode } = require('./services/helper');
const TMDBAPI = require('./services/tmdbapi');

const database = new Database(config);
database.connect();
const db = database.db();

const userRepo = new UserRepository(db);

let sess;
const mailer = new Mailer();
mailer.setup();

const tmdbapi = new TMDBAPI();

app.use(session({secret: config.SESSION_SECRET}));
app.use(bodyParser.json() );
app.use(bodyParser.urlencoded({     
  extended: true
})); 

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use('/', express.static(publicPath));

app.get('/', function (req, res) {
    res.render('home');
});

app.post('/', async (req, res) => {
    const fullname = req.body.fullname;
    const email = req.body.email;
    const password = req.body.password;
    const verif_code = genVerifCode();

    bcrypt.genSalt(parseInt(config.SALT_ROUNDS), function(err, salt) {
        if (err) {
            console.error(err);
        }
        bcrypt.hash(password, salt, function(err, hash) {
            if (err) {
                console.error(err);
            } else {
                //(name,email,password,verif_code)
                userRepo.createUser(fullname, email, hash, verif_code.toString());
                mailer.sendMail('Verif code: ' + verif_code, [email]);
                sess = req.session;
                sess.email = email;
                res.render('confirmation');
            }
        });
    });
    
});

app.get('/confirmEmail', (req, res) => {
    let { n1, n2, n3, n4, n5 } = req.query;
    const verif_code = n1 + n2 + n3 + n4 + n5;
    sess = req.session;
    const email = sess.email;

    if(email) {
        const user = userRepo.getUserByEmail(email, verif_code.trim());
        if (user != null) {
            userRepo.updateVerifiedUser(email);
            res.render('unsub');
        }
    } else {
        console.log('No session');
    }
});

app.get('/unsubscribe', (req, res) => {
    sess = req.session;
    const email = sess.email;
    if (email) {
        userRepo.deleteUser(email);
        res.render('home');
    } else {
        console.log('No session');
    }
})

app.listen(3000, () => {
    console.log('Listening on port:3000');
});

cron.schedule('5 * * * * *', () => {
    let emails = [];
    tmdbapi.fetchRandomMovie().then((movie) => {
        console.log('movie:. ', movie);
        userRepo.getUsers().then((users) => {
            console.log('users:. ', users);
            if (users.length > 0) {
                users.forEach(element => {
                    emails.push(element.email);
                });
                mailer.sendMail('Movie title: '+ movie.title, emails);
            } else {
                console.log('No users found.');
            }
        }).catch(console.error);
    }).catch(console.error)
});