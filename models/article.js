const   mongoose            = require("mongoose"),
        uniqueValidator     = require("mongoose-unique-validator");

// Create schema for db
const Schema = mongoose.Schema;

// Create article scehma
const ArticleSchema = new Schema ({
    
    // title for article
    title: {
        type: String,
        required: true
    },
    //l ink to article
    link: {
        type:String,
        unique: true,
        required: true
    },
    // save article or not
    saved: {
        type: Boolean,
        required: true,
        default: false
    },
    //d elete article or not
    deleted: {
        type: Boolean,
        required: true,
        default: false
      },
    // date is set when added to database
    date: {
        type: Date,
        default: Date.now
      },
    // notes is an array of reference ids
    notes: [{
        type: Schema.Types.ObjectId,
        ref: "Note",
        required: false
        }]

});

// plugin to make articles unique
ArticleSchema.plugin(uniqueValidator);

// create article model
const Article = mongoose.model("Article" , ArticleSchema);

// export Article for other uses
module.exports = Article;