const path = require('path');
const passport = require('passport');
const userModel = require(path.join(__dirname, '../models/users.models'));
const itemModel = require(path.join(__dirname, '../models/items.models'));
const connectEnsureLogin = require('connect-ensure-login');

const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express.Router();


// GET
app.get('/', (req, res) => {
    if (req.isAuthenticated()) {res.redirect('/list')};
    res.render('index');
});

app.get('/list', connectEnsureLogin.ensureLoggedIn('/'), (req, res) => {
    var sum = 0
    itemModel.aggregate([{ $group: { _id: null, amount: { $sum: "$total" } }}]).then(result => {sum = result[0].amount});
    itemModel.find({}).exec().then(items => {res.render('list', {"page_name": "list", "items": items, "total": sum})});
});

app.get('/receipts', connectEnsureLogin.ensureLoggedIn('/'), (req, res) => {
    res.render('add-item', {"page_name": "receipts"});
});

app.get('/deleted', connectEnsureLogin.ensureLoggedIn('/'), (req, res) => {
    res.render('add-item', {"page_name": "deleted"});
});


// Add-item
app.get('/add-item', connectEnsureLogin.ensureLoggedIn('/'), (req, res) => {
    res.render('add-item', {"page_name": "add-item"});
});

function addItemFunc(req, res) {
    const itemName = req.body.name;
    const itemAmount = parseFloat(req.body.amount);
    const itemPrice = parseFloat(req.body.price);

    itemModel.collection.insertOne({name: itemName, amount: itemAmount, price: itemPrice, total: itemPrice * itemAmount, active: true}, (err) => {
        if (err) {
            console.log('Error while registering item.');
            console.log(err);
            return err;
        }

        console.log('Item registered.');
    });

        return res.redirect('/add-item');
}

app.post('/add-item', connectEnsureLogin.ensureLoggedIn('/'), (req, res) => {
    addItemFunc(req, res);
});


// LOGOUT
app.get('/logout', connectEnsureLogin.ensureLoggedIn('/'), (req, res) => {
    req.logout(req.user, err => {
        if(err) return next(err);
        res.redirect('/');
    });
});

// LOGIN
app.post('/login', passport.authenticate('local', { successRedirect: '/list', failureRedirect: '/' }), (req, res) => {
	console.log(req.user);
});


// REGISTER
function registerFunc(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const verifyPassword = req.body.verifypassword;
    var admin = true;

    if (password != verifyPassword) {
        console.log('Error while registering user: Passwords have to match.');
        return res.redirect('/register');
    };

    userModel.register({username: username, admin: admin}, password, (err) => {
        if (err) {
            console.log('Error while registering user.');
            console.log(err);
            return err;
        }

        console.log('User registered.');
    });

        return res.redirect('/register');
};

if (process.env.REQUIRE_PASSWORD_FOR_REGISTER === 'False') {
    app.get('/register', (req, res) => {
        res.render('register')
    });
} else {
    app.get('/register', connectEnsureLogin.ensureLoggedIn('/'), (req, res) => {
        if (req.user.admin) {
            res.render('register')
        } else {
            res.redirect('/logout');
        };
    });
};

if (process.env.REQUIRE_PASSWORD_FOR_REGISTER === 'False') {
    app.post('/register', (req, res) => {
        registerFunc(req, res);
    });
} else {
    app.post('/register', connectEnsureLogin.ensureLoggedIn('/'), (req, res) => {
        if (req.user.admin) {
            registerFunc(req, res);
        } else {
            res.redirect('/logout');
        };
    });
};


module.exports = app;