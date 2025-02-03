const express = require('express');
const app = express.Router();


// GET
app.get('/', (req, res) => {
    res.render('index');
});

module.exports = app;