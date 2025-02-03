const dotenv = require('dotenv');
dotenv.config();
const path = require('path');
const express = require('express');

const appRouter = require(path.join(__dirname, 'src/routes/router'));
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/views'));

const port = process.env.PORT;

app.use('/', appRouter);

app.listen(port, () => console.log(`Listening on port: ${port}`));