const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Story schema
const connectionSchema = new Schema({
    name: {type: String, required: [true, 'A title is required.'], minLength: [8, 'Title must be more than 8 characters']},
    topic: {type: String, required: [true, 'A topic is required.'], minLength: [3, 'Topic must be more than 3 characters']},
    details: {type: String, required: [true, 'Details are required.'], minLength: [10, 'Details must be more than 10 characters']},
    location: {type: String, required: [true, 'A location is required'], minLength: [8, 'Location must be more than 8 characters']},
    date: {type: Date, required: [true, 'A date is required.']},
    start: {type: String, required: [true, 'A start time is required']},
    end: {type: String, required: [true, 'A end time is required']},
    host: {type: Schema.Types.ObjectId, ref: 'User', required: [true, 'A host is required']},
    imageURL: {type: String, required: [true, 'A location is required']}
},
{
    timestamps: true
});

module.exports = mongoose.model('Connection', connectionSchema);