'use strict';
const express = require('express'),
      router = express.Router(),
      request = require('request'),
      cheerio = require('cheerio'),
      Article = require('../../models/article');
     

// get all articles from database
router.get('/', function(req, res) {
    Article
        .find({})
        .exec(function(error, docs) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                res.status(200).json(docs);
            }
        });
});

// get all saved articles
router.get('/saved', function(req, res) {
    Article
        .find({})
        .where('saved').equals(true)
        .where('deleted').equals(false)
        .populate('notes')
        .exec(function(error, docs) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                res.status(200).json(docs);
            }
        });
});

// get all deleted articles
router.get('/deleted', function(req, res) {
    Article
        .find({})
        .where('deleted').equals(true)
        .exec(function(error, docs) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                res.status(200).json(docs);
            }
        });
});

// save an article
router.post('/save/:id', function(req, res) {
    Article.findByIdAndUpdate(req.params.id, {
        $set: { saved: true}
        },
        { new: true },
        function(error, doc) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                res.redirect('/');
            }
        });
});

// dismiss a scraped article
router.delete('/dismiss/:id', function(req, res) {
    Article.findByIdAndUpdate(req.params.id,
        { $set: { deleted: true } },
        { new: true },
        function(error, doc) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                res.redirect('/');
            }
        });
});

// delete a saved article
router.delete('/:id', function(req, res) {
    Article.findByIdAndUpdate(req.params.id,
        { $set: { deleted: true} },
        { new: true },
        function(error, doc) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                res.redirect('/saved');
            }
        }
    );
});

// scrape articles
router.get('/scrape', function(req, res, next) {
    request('https://news.ycombinator.com', function(error, response, html) {
        let $ = cheerio.load(html);
        let results = [];
        $('tr.athing td.title').each(function(i, e) {
            let title = $(this).children('a').text(),
                link = $(this).children('a').attr('href'),
                single = {};
            if (link !== undefined && link.includes('http') &&  title !== '') {
                single = {
                    title: title,
                    link: link
                };
                // create new article
                let entry = new Article(single);
                // save to database
                entry.save(function(err, doc) {
                    if (err) {
                        if (!err.errors.link) {
                            console.log(err);
                        }
                    } else {
                        console.log('new article added');
                        
                    }
                });
            }
        });
        next();
    });
}, function(req, res) {
    res.redirect('/');
});

module.exports = router;