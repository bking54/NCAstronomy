//imported modules
const express = require('express');
const morgan = require('morgan');
const mo = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const connectionRoutes = require('./routes/connectionRoutes');
const mainRoutes = require('./routes/mainRoutes');

//create
const app = express();

//config
let port = 3000;
let host = 'localhost';
let dburl = 'mongodb://localhost:27017/NBAD';
app.set('view engine', 'ejs');

//connect to database
mongoose.connect(dburl, {useNewUrlParser: true, useUnifiedTopology: true/*, useCreateIndex: true */})
.then(() => {
    //listen at port
    app.listen(port, host, () => {
        console.log('app running at port', port);
    })
})
.catch(err => console.log(err.message));

//middleware
app.use(mo('_method'));
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));

app.use(session({
    secret: 'wibufwuiefuiwef867j67j67934h83gh',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 60*60*1000},
    store: new MongoStore({mongoUrl: dburl})
}));

app.use(flash());

app.use((req, res, next) => {
    console.log(req.session);
    res.locals.user = req.session.user || null;
    res.locals.successMessages = req.flash('success');
    res.locals.errorMessages = req.flash('error');
    next();
});

//routes
app.use('/', mainRoutes);
app.use('/connections', connectionRoutes);
app.use('/users', userRoutes);

//404 Handling
app.use((req, res, next) => {
    let err = new Error('Cannot locate the resource located at ' + req.url);
    err.status = 404;
    next(err);
});

//Error handling
//Comment out when debugging
app.use((err, req, res, next) => {
    if(!err.status) {
        err.status = 500;
        err.message = 'Internal Server Error';
    }
    res.status(err.status);
    res.render('error', {error: err});
});
