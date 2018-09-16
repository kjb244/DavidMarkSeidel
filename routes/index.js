'use strict';

let express = require('express');
let router = express.Router();
let path = require('path');
let content = require('../copy/content.json');
let dbutils = require('../utils/dbUtils.js');
let emailutils = require('../utils/emailUtils');

//GETS
router.get('/', function(req, res, next) {
    const content = {
        title: 'David Mark Seidel - Wedding Officiant, Planner, Vocalist Charlotte NC',
        metaContent: 'David Mark Seidel - Wedding Officiant, Planner, Vocalist Charlotte NC non-denominational Spanish Espanol Same Sex Unions Welcome'
    };
    res.render('index', content);

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
    const prom = dbutils.getValue('copy');
    prom.then(function(e){
       return res.json(JSON.parse(e));
    });
});



router.get('/getAuthenticated', function(req, res){
    const username = req.query.username;
    const password = req.query.password;
    const loginProm =   dbutils.authenticateUser(username,password);

    loginProm.then(function(){
        return res.json('success');
    }).catch(function(){
        return res.json('');
    })
});

router.post('/submitContactInfo', function(req, res) {
    const data = req.body.data;
    const {name, email, phone, comments} = data;
    const emailProm = emailutils.sendEmailContact(name, email, phone, comments);
    emailProm.then(function(){
        return res.json('success');
    }).catch(function(){
        return res.json('failure');
    })

});

router.post('/submitCmsUpdate', function(req, res) {
    const data = req.body.data;
    const model = data.model;
    const login = data.login;
    const loginProm =   dbutils.authenticateUser(login.username,login.password);
    loginProm.then(function(){
        const changeToJsonString = JSON.stringify(model).replace(/'/g,"''");
        const prom = dbutils.updateKeyByValue('copy',changeToJsonString);
        prom.then(function(e){
            const pullFromDb = dbutils.getValue('copy');
            pullFromDb.then(function(e2){
                return res.json(JSON.parse(e2));
            })
        }).catch(function(){

        })
    }).catch(function(){
        res.json({});
    });





});











module.exports = router;
