const dotenv = require('dotenv');
dotenv.config();
const path = require('path');

const passport = require('passport');
const session = require('express-session');
const User = require(path.join(__dirname, '/src/models/users.models'));

const bodyParser = require('body-parser');
const express = require('express');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');

// Sets a maximum of 10000 requests per ip for a 15 minute window.
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 8000,
    handler: () => console.log("User being rate limited")
});

// Slow down request rate after 100 requests by the amount of requests times 200ms within a 15 minute window.
const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000,
    delayAfter: 10,
    delayMs: (hits) => hits * 100, // Slows down for hits * 100 ms.
});

const appRouter = require(path.join(__dirname, 'src/routes/router'));
const app = express();

const port = process.env.PORT;

// Rate limiting:
app.use(limiter);
app.use(speedLimiter);

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