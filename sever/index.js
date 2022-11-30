require('dotenv').config();
const { request } = require('express');
const hbs = require('hbs');
const express = require('express');
const app = express();
const port = process.env.APP_PORT;
const general = require('./routers/general');
const posts = require('./routers/posts');

app.use('/config',express.static("config"));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
app.use('/',general);
app.use('/p',posts)





app.listen(port, () => { console.log('running '  + port); });