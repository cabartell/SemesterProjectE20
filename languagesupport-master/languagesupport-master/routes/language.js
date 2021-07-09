const router = require('express').Router();
const csvFetcher = require('../csvFetcher');
let Language = require('../models/language.model');
const cors = require('cors');

let corsOptions = {
  "origin": "*",
  "methods": "GET,POST",
  "preflightContinue": false,
  "optionsSuccessStatus": 200
}

router.use(cors(corsOptions));

/**
 * Get a list of all the languages
 */
router.route('/').get((req, res) => {
  Language.find({})
    .then(languages => res.json(languages))
    .catch(err => res.status(400).json(err));
});

/**
 * Get language from id
 */
router.route('/id/:id').get((req, res) => {
  Language.findById(req.params.id)
    .then(language => res.json(language))
    .catch(err => res.status(400).json(err));
});

/**
 * Get language from code
 */
router.route('/code/:code').get((req, res) => {
  Language.findOne({ code: req.params.code })
    .then(language => res.json(language))
    .catch(err => res.status(400).json(err));
});

/**
 * Get language from language name
 */
router.route('/language/:name').get((req, res) => {
  Language.findOne({ language: { $regex: req.params.name, '$options': 'i' } })
    .then(language => res.json(language))
    .catch(err => res.status(400).json(err));
});

/**
 * Get all languages/native/id
 */
router.route('/languages').get((req, res) => {
  Language.find({}, { language: 1, nativeLanguage: 1, code: 1 })
    .then(language => res.json(language))
    .catch(err => res.status(400).json(err));
});

/**
 * Update languages from google sheets
 */
router.route('/update').post((req, res) => {
  csvFetcher.fetch();
  console.log("updating languages");
  res.json("Updating languages...");
});

/**
 * Get last time updated
 */
router.route('/update').get((req, res) => {
  console.log(`[#] Last updated | ${csvFetcher.lastUpdated()}`);
  res.json(csvFetcher.lastUpdated());
});

module.exports = router;
