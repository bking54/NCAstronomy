const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    firstName: {type: String, required: [true, 'A first name is required']},
    lastName: {type: String, required: [true, 'A last name is required']},
    email: {type: String, required: [true, 'A email is required'], unique: [true, 'Email already in use']},
    password: {type: String, required: [true, 'A password is required']}
});

//hash password before saving to db
userSchema.pre('save', function(next){
    let user = this;
    if (!user.isModified('password')) return next();
    bcrypt.hash(user.password, 10)
    .then(hash => {
        user.password = hash;
        next();
    })
    .catch(err => next(err));
});

//compare input to hash
userSchema.methods.comparePassword = function(loginPassword) {
    return bcrypt.compare(loginPassword, this.password);
}

module.exports = mongoose.model('User', userSchema);