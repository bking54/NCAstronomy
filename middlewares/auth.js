const Connection = require('../models/connection');

exports.isAuthor = (req, res, next) => {
    let id = req.params.id;
    Connection.findById(id)
    .then(con => {
        if (con) {
            if (con.host == req.session.user) {
                next();
            } else {
                let err = new Error('Unauthorized access to this resource');
                err.status = 401;
                next(err);
            }
        } else {
            let err = new Error('Cannot find a connection with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
}

exports.isNotAuthor = (req, res, next) => {
    let id = req.params.id;
    Connection.findById(id)
    .then(con => {
        if (con) {
            if (con.host != req.session.user) {
                next();
            } else {
                let err = new Error('Unauthorized access to this resource');
                err.status = 401;
                next(err);
            }
        } else {
            let err = new Error('Cannot find a connection with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
}

exports.isGuest = (req, res, next) =>  {
    if (!req.session.user) {
        next();
    } else {
        req.flash('error', 'You are already logged in');
        res.redirect('/users/profile');
    }
}

exports.isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        req.flash('error', 'You need to log in first');
        res.redirect('/users/index');
    }
}