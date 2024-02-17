const model = require('../models/user');
const Connection = require('../models/connection');
const Rsvp = require('../models/rsvp');

exports.index = (req, res) => {
    res.render('./user/login');
}

exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            return next(err);
        } else {
            res.redirect('/')
        }
    });
}

exports.create = (req, res) => {
    res.render('./user/new');
}

exports.new = (req, res, next) => {
    let user = new model(req.body);
    if (user.email) user.email = user.email.toLowerCase();
    user.save()
    .then(() => res.render('./user/login'))
    .catch(err => {
        if (err.name === 'ValidationError') {
            req.flash('error', err.message);
            res.redirect('users/new');
        }
        if(err.code === 11000) {
            req.flash('error', 'Email already in use');
            res.redirect('/users/new');
        }
        next(err);
    });
    
}

exports.login = (req, res, next) => {
    let email = req.body.email;
    if (email) email = email.toLowerCase();
    let password = req.body.password;
    //get matching user
    model.findOne({email: email})
    .then(user => {
        if (user) {
            user.comparePassword(password)
            .then(result => {
                if (result) {
                    req.session.user = user._id; //store user id in session
                    req.flash('success', 'Logged in successfully');
                    res.redirect('/');
                } else {
                    req.flash('error', 'Incorrect password');
                    res.redirect('/users/index');
                }
            });
        } else {
            req.flash('error', 'Invalid email address');
            res.redirect('/users/index');
        }
    })
    .catch(err => next(err));
}

exports.profile = (req, res, next) => {
    let id = req.session.user;
    Promise.all([model.findById(id), Connection.find({host: id}), Rsvp.find({user: id}).populate('connection', 'name topic _id')])
    .then(results => {
        const [user, connections, rsvps] = results;
        res.render('./user/profile', {user, connections, rsvps})
    })
    .catch(err => next(err));
}