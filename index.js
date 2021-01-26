const express = require('express');
const exphbs  = require('express-handlebars');
const path = require('path');
const app = express();
const publicPath = path.join(__dirname, './views');

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use('/', express.static(publicPath));

app.get('/', function (req, res) {
    res.render('home');
});

app.listen(3000);