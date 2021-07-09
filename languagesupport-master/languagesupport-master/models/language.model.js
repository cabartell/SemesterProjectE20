const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const languageSchema = new Schema({
    language: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    nativeLanguage: { type: String, required: true },
    strings: { type: Object, required: true }
});

module.exports = mongoose.model('Language', languageSchema);