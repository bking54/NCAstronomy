const model = require('../models/connection');
const Rsvp = require('../models/rsvp');

//GET operations

//Get all connections and render connection/index.ejs
exports.index = (req, res, next) => {
    model.find()
    .then((unsortedConnections) => {
        //Get all unique topics
        let topics = [];
        unsortedConnections.forEach(element => {
            if (topics.length > 0) {
                let isNew = true;
                topics.forEach(topic => {
                    if (topic === element.topic) isNew = false;
                });
                if (isNew) topics.push(element.topic);
            } else {
                topics.push(element.topic);
            }
        });

        //Sort connections by topic
        let connections = [];
        if (topics.length > 0) connections.push(topics);
        let index = 0;
        topics.forEach(topic => {
            let matches = unsortedConnections.filter(element => topic === element.topic);
            connections.push(matches);
        });

        res.render('./connection/index', {connections});
    })
    .catch(err => next(err));
}

//Render the new connection page for the user
exports.new = (req, res) => {
    res.render('./connection/new');
}

//Render the page of a unique connection
exports.show = (req, res, next) => {
    let id = req.params.id;

    model.findById(id).populate('host', 'firstName lastName')
    .then((con) => {
        if (con) {
            Rsvp.find({connection: id})
            .then((results) => {
                let numResults = results.length
                res.render('./connection/show', {con, numResults});
            })
            .catch(err => next(err));
        } else {
            let err = new Error('Cannot find connection with id ' + id);
            err.status = 404;
            next(err);
        }    
    })
    .catch(err => next(err));
}

//Render the editing page of a unique connection
exports.edit = (req, res, next) => {
    let id = req.params.id;

    model.findById(id)
    .then((con) => {
        if (con) {
            res.render('./connection/edit', {con});
        } else {
            let err = new Error('Cannot find connection with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
}

//POST operations

//Add a connection to the model and redirect to the connections page
exports.create = (req, res, next) => {
    let con = new model(req.body);
    con.host = req.session.user;
    con.save()
    .then(() => {
        res.redirect('/connections');
    })
    .catch((err) => {
        if (err.name = 'ValidationError') {
            req.flash('Validation Error');
            res.redirect('back');
        }
        next(err);
    });
}

//Add a RSVP
exports.rsvp = (req, res, next) => {
    let id = req.params.id;
    let user = req.session.user;

    let rsvp = new Rsvp({connection: id, user: user});

    Rsvp.findOne({connection: id, user: user})
    .then((doc) => {
        if (doc) {
            req.flash('error', 'Already RSVPed for this event');
            res.redirect('/');
        } else {
            rsvp.save()
            .then(() => {
                res.redirect('/');
            })
            .catch((err) => {
                if (err.name = 'ValidationError') {
                    req.flash('Cannot find connection with id: ' + id);
                    res.redirect('back');
                }
                next(err);
            });
        }
    })
    .catch(err => next(err));
}

//PUT operations

//Update the array of connections and redirect to the update page
exports.update = (req, res, next) => {
    let con = req.body;
    let id = req.params.id;

    model.findByIdAndUpdate(id, con, {useFindAndModify: false, runValidators: true})
    .then((updatedCon) => {
        if (updatedCon) {
            res.redirect('/connections/' + id);
        } else {
            let err = new Error('Cannot find connection with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch((err) => {
        if (err.name = 'ValidationError') {
            req.flash('Validation Error');
            res.redirect('back');
        }
        next(err);
    });
}

//DELETE operations

//Delete the specified connection and redirect to connections page
exports.delete = (req, res, next) => {
    let id = req.params.id;

    model.findByIdAndDelete(id, {useFindAndModify: false})
    .then((con) => {
        if (con) {
            Rsvp.deleteMany({connection: id})
            .then((rsvps) => {
                console.log(rsvps);
                res.redirect('/connections');
            })
            .catch(err => next(err));
        } else {
            let err = new Error('Cannot find connection with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
}