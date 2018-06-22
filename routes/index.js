'use strict';

let express = require('express');
let router = express.Router();
let path = require('path');
let content = require('../copy/content.json');
let dbutils = require('../utils/dbUtils.js');

//GETS
router.get('/', function(req, res, next) {
  res.render('index', {});

});

router.get('/partials/:name', function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
});

router.get('/directive_templates/:name', function (req, res) {
  var name = req.params.name;
  res.sendFile(path.join(__dirname, '../', 'views', 'directive_templates', name));
});

router.get('/route_templates/:name', function (req, res) {
    var name = req.params.name;
    res.sendFile(path.join(__dirname, '../', 'views', 'route_templates', name));
});

router.get('/getContent', function(req, res){
  return res.json(content);
});












module.exports = router;
