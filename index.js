const express = require('express');
const exphbs  = require('express-handlebars');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

const publicPath = path.join(__dirname, './views');

const { config } = require('./config');
console.log('config:sqldb:.', config);
const { Database } = require('./database');
const { UserRepository } = require('./repositories/user');

const database = new Database(config);
database.connect();
const db = database.db();
const userRepo = new UserRepository(db);
    
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

app.post('/', (req, res) => {
    const fullname = req.body.fullname;
    const email = req.body.email;
    const password = req.body.password;
    const verif_code = Math.floor(Math.random() * 90000) + 10000;
    userRepo.createUser(fullname, email, password, verif_code);
    res.render('confirmation');
});

app.get('/confirmEmail', (req, res) => {
    //const users = userRepo.getUsers();
    
})

app.listen(3000, () => {
    console.log('Listening on port:3000');
});