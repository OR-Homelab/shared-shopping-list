const dotenv = require('dotenv');
dotenv.config();
const path = require('path');

const passport = require('passport');
const session = require('express-session');
const User = require(path.join(__dirname, '/src/models/users.models'));

const bodyParser = require('body-parser');
const express = require('express');

const appRouter = require(path.join(__dirname, 'src/routes/router'));
const app = express();

const port = process.env.PORT;

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 }
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: false } ));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'public/views'));
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', appRouter);

app.listen(port, () => console.log(`Listening on port: ${port}`));