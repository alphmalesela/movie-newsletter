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
    
    userRepo.getUserByEmail(email).then((user) => {
        console.log('user:.', user);
        if (user == undefined) {
            bcrypt.genSalt(parseInt(config.SALT_ROUNDS), function(err, salt) {
                if (err) {
                    console.error(err);
                }
                bcrypt.hash(password, salt, function(err, hash) {
                    if (err) {
                        console.error(err);
                    } else {
                        const verif_code = genVerifCode().toString();
                        userRepo.createUser(fullname, email, hash, verif_code);
                        mailer.sendMail('Verif code: ' + verif_code, [email]);
                        sess = req.session;
                        sess.email = email;
                        res.render('confirmation');
                    }
                });
            });
            
        } else {
            sess = req.session;
            sess.email = email;
            
            bcrypt.compare(password, user.password, function(err, result) {
                if (err) {
                    console.error(err);
                }
                if (result == true){
                    if (user.verified == 1) {
                        //user verified unsub view
                        res.render('unsub');
                    } else {
                        //user confirmation 
                        res.render('confirmation');
                    }
                } else {
                    //user wrong password
                    res.render('home');
                }
            });
        }
    }).catch(console.error);
});

app.get('/confirmEmail', (req, res) => {
    let { n1, n2, n3, n4, n5 } = req.query;
    const verif_code = n1 + n2 + n3 + n4 + n5;
    sess = req.session;
    const email = sess.email;

    if(email) {
        const user = userRepo.getUserByEmailVerif(email, verif_code.trim());
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
        console.log('fetchRandomMovie movie:.');
        if (movie != null) {
            userRepo.getUsers().then((users) => {
                if (users.length > 0) {
                    users.forEach(element => {
                        emails.push(element.email);
                    });
                    mailer.sendMail(movie, emails);
                } else {
                    console.log('No users found.');
                }
            }).catch(console.error);
        }
    }).catch(console.error)
});