// import modules
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const passport = require('./config/passport');

// import routers
const userRouter = require('./routes/users.route');
const vendorRouter = require('./routes/vendors.route');
const adminRouter = require('./routes/admins.route');
const menuRouter = require('./routes/menu.route');
const orderRouter = require('./routes/orders.route');
const passportRouter = require('./routes/passport.route');

// initialize dependencies
const app = express();
dotenv.config();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use('uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({ origin: 'http://localhost:8100', credentials: true }));

// configure session middleware
app.use(session({
    secret: 'fantom',
    resave: false,
    saveUninitialized: true
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// html routes
app.get('/resq-eats/reset-password/:token', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/resq-eats/verify-email/:token', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'verify-email-confirmation.html'));
});
app.get('/resq-eats/google-auth', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'oauth.html'));
});

// port to be used
const port = process.env.PORT || 3000;

// express routes
app.use('/users', userRouter);
app.use('/vendors', vendorRouter);
app.use('/admins', adminRouter);
app.use('/menu', menuRouter);
app.use('/orders', orderRouter);
app.use('/auth', passportRouter);

// listen on port
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});