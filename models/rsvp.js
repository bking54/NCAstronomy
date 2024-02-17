const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rsvpSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User', required: [true, 'A host is required']},
    connection: {type: Schema.Types.ObjectId, ref: 'Connection', required: [true, 'A connection is required']}
});

module.exports = mongoose.model('Rsvp', rsvpSchema);