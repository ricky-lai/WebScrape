const mongoose = require('mongoose'),
      uniqueValidator = require('mongoose-unique-validator');

// create Schema class
const Schema = mongoose.Schema;

// create note schema
const NoteSchema = new Schema({
  // title is a required string
  text: {
    type: String,
    required: true
  },
  // date is set when added to database
  date: {
    type: Date,
    default: Date.now
  }
});

// add unique-validator plugin
NoteSchema.plugin(uniqueValidator);

// create the Note model with the NoteSchema
const Note = mongoose.model("Note", NoteSchema);

// export the model
module.exports = Note;