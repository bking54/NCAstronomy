const validator = require('express-validator');

exports.validateId = (req, res, next) => {
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    } else {
        next();
    }
}

exports.validateConnection = (req, res, next) => {
    validator.body('name', 'Invalid title').not().isEmpty().trim().escape();
    validator.body('details', 'Invalid content').isLength({min: 10}).trim().escape();
    next();
}