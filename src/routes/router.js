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

app.get("/receipts", connectEnsureLogin.ensureLoggedIn("/"), (req, res) => {
    res.render("receipts", { page_name: "receipts" });
  });


// Deleted
app.get('/deleted', connectEnsureLogin.ensureLoggedIn('/'), async (req, res) => {
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    await itemModel.deleteMany({"active": false, "age": {$lte: yesterday}}).then(obj => {
        if (obj.deletedCount != 0) {
            console.log(`Deleted ${obj.deletedCount} old document(s).`);
        }
    });

    itemModel.find({active: false}).exec().then(items => {res.render('deleted', {"page_name": "deleted", "items": items})});
});

app.post('/deleted', connectEnsureLogin.ensureLoggedIn('/'), async (req, res) => {
    const readdId = req.body.readdId;
    
    if (readdId === "") {
        return;
    }
    try {
        await itemModel.findByIdAndUpdate(readdId, {$set: {active: true}});
    } catch (err) {
        console.log('Error while readding item.')
        console.log(err);
        return err;
    }

    console.log("Item readded.");
    return res.redirect('/deleted');
});


// List
app.get('/list', connectEnsureLogin.ensureLoggedIn('/'), async (req, res) => {
    var sum = 0
    await itemModel.aggregate([{ $match: { active: true } }, { $group: { _id: null, amount: { $sum: "$total" } }}]).then(result => {
        if (result[0] === undefined) {
            return;
        }
        sum = result[0].amount;
    });
    itemModel.find({active: true}).exec().then(items => {res.render('list', {"page_name": "list", "items": items, "total": sum})});
});

app.post('/list', connectEnsureLogin.ensureLoggedIn('/'), async (req, res) => {
    const deleteId = req.body.deleteId;
    
    if (deleteId === "") {
        return;
    }
    try {
        await itemModel.findByIdAndUpdate(deleteId, {$set: {active: false , age: new Date()}});
    } catch (err) {
        console.log('Error while removing item.')
        console.log(err);
        return err;
    }

    console.log("Item removed.");
    return res.redirect('/list');
});


// Add-item
app.get('/add-item', connectEnsureLogin.ensureLoggedIn('/'), (req, res) => {
    res.render('add-item', {"page_name": "add-item"});
});

app.post('/add-item', connectEnsureLogin.ensureLoggedIn('/'), (req, res) => {
    const itemName = req.body.name;

    var itemPrice;
    if (req.body.price === "") {
        itemPrice = 0;
    } else {
        itemPrice = parseFloat(req.body.price);
    }

    var itemAmount;
    if (req.body.amount === "") {
        itemAmount = 1;
    } else {
        itemAmount = parseFloat(req.body.amount);
    }
    

    itemModel.collection.insertOne({name: itemName, amount: itemAmount, price: itemPrice, total: itemPrice * itemAmount, active: true, age: new Date()}, (err) => {
        if (err) {
            console.log('Error while registering item.');
            console.log(err);
            return err;
        }

        console.log('Item registered.');
    });

    return res.redirect('/add-item');
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
        res.render('register', {"page_name": "register"});
    });
} else {
    app.get('/register', connectEnsureLogin.ensureLoggedIn('/'), (req, res) => {
        if (req.user.admin) {
            res.render('register', {"page_name": "register"});
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

/*
*  API
*/

// API get items
app.get('/api/get', connectEnsureLogin.ensureLoggedIn('/'), async (req, res) => {
    res.json({products: await itemModel.find({}).exec()});
});

// API add item
app.post('/api/add', connectEnsureLogin.ensureLoggedIn('/'), async (req, res) => {
    const item = req.body;

    // Catch missing data fields.
    if ( !('name' in item) || item.name === "" || !('amount' in item) || !('price' in item)) {
        let err = new Error("Missing data inputs!");
        console.log(err)
        res.json({error: "Missing data inputs!", productAdded: false});
        return err;
    }

    const itemName = item.name;

    let itemPrice;
    if (item.price === "") {
        itemPrice = 0;
    } else {
        itemPrice = parseFloat(item.price);
    }

    let itemAmount;
    if (item.amount === "") {
        itemAmount = 1;
    } else {
        itemAmount = parseFloat(item.amount);
    }
    

    itemModel.collection.insertOne({name: itemName, amount: itemAmount, price: itemPrice, total: itemPrice * itemAmount, active: true, age: new Date()}, (err) => {
        if (err) {
            console.log('Error while registering item.');
            console.log(err);
            res.json({error: err, productAdded: false});
            return err;
        }

        console.log('Item registered.');
    });

    res.json({products: item, productAdded: true});
});

// API remove items
app.post('/api/remove', connectEnsureLogin.ensureLoggedIn('/'), async (req, res) => {
    const item = req.body;

    // Catch missing data fields.
    if (!('id' in item)) {
        let err = new Error("Missing data inputs!");
        console.log(err)
        res.json({error: "Missing data inputs!", productRemoved: false});
        return err;
    }

    const itemId = item.id;
    
    try {
        await itemModel.findByIdAndUpdate(itemId, {active: false, age: new Date()});
    } catch (err) {
        console.log('Error while removing item.');
        console.log(err);
        res.json({error: err, productRemoved: false});
        return err;
    }

    console.log('Item Removed.');

    res.json({products: item, productRemoved: true});
});

// API edit item by ID
app.post('/api/edit', connectEnsureLogin.ensureLoggedIn('/'), async (req, res) => {
    const item = req.body;

    // Catch missing data fields.
    if (!('id' in item)) {
        let err = new Error("Missing data inputs!");
        console.log(err)
        res.json({error: "Missing data inputs!", productEdited: false});
        return err;
    }

    const itemId = item.id;
    let itemName, itemAmount, itemPrice;

    if ('name' in item) itemName = item.name;
    if ('amount' in item) itemAmount = item.amount;
    if ('price' in item) itemPrice = item.price;

    try {
        let editItem = await itemModel.findById(itemId);
        
        if (itemName === undefined) itemName = editItem.name;
        if (itemAmount === undefined) itemAmount = editItem.amount;
        if (itemPrice === undefined) itemPrice = editItem.price;
        let total = itemPrice * itemAmount

        await itemModel.findByIdAndUpdate(itemId, {'name': itemName, 'amount': itemAmount, 'price': itemPrice, 'total': total, 'age': new Date()});
    } catch (err) {
        console.log('Error while editing item.');
        console.log(err);
        res.json({error: err, productEdited: false});
        return err;
    }

    console.log('Item edited.');

    res.json({products: item, productEdited: true});
});


app.get('*', connectEnsureLogin.ensureLoggedIn('/'), (req, res) => {
    res.render('404', {'page_name': '404'});
});


module.exports = app;