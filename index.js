const express = require('express');
const exphbs  = require('express-handlebars');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json() );
app.use(bodyParser.urlencoded({     
  extended: true
})); 

const publicPath = path.join(__dirname, './views');

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use('/', express.static(publicPath));

app.get('/', function (req, res) {
    res.render('home');
});

app.post('/', function (req, res) {
    console.log('req.body:. ');
    console.log(req.body);
    res.render('confirmation');
});

app.listen(3000, () => {
    console.log('Listening on port:3000');
});