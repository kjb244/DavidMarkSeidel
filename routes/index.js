'use strict';

let express = require('express');
let router = express.Router();
let path = require('path');
let fs = require('fs');
let content = require('../copy/content.json');
let dbutils = require('../utils/dbUtils.js');
let utils = require('../utils/utils');
let memoryCache = require('memory-cache');
let videoFilePath = '../public/videos/dms.mp4';

//GETS
router.get('/', function(req, res, next) {

    const content = {
        title: 'David Mark Seidel - Wedding Officiant, Planner, Vocalist Charlotte NC',
        metaContent: 'David Mark Seidel - Wedding Officiant, Planner, Vocalist Charlotte NC non-denominational Spanish Espanol Same Sex Unions Welcome'
    };
    if((process.env.IS_PROD || '') === 'true' && req.protocol === 'http'){
        res.redirect('https://' + req.headers.host + req.url);
    } else {
        res.render('index', content);


    }

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
    //return res.json(content);
    const copyProm = dbutils.getValue('copy');
    copyProm.then(function(copy){
        return res.json(JSON.parse(copy));
    })
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
    const {name, email, phone, comments, checkboxModel} = data;
    const emailProm = utils.sendEmailContact(name, email, phone, comments, checkboxModel);
    const smsProm = utils.sendSmsContact(name, email, phone, comments, checkboxModel);
    Promise.all([emailProm, smsProm])
        .then(()=>{
            return res.json('success');
        }).catch((err) =>{
        console.log('error submitting contact info', err);
        return res.json('failure');
    })

});

router.post('/submitCmsUpdate', function(req, res) {
    const data = req.body.data;
    const model = data.model;
    const login = data.login;
    const loginProm = dbutils.authenticateUser(login.username, login.password);
    loginProm.then(function () {
        const changeToJsonString = JSON.stringify(model).replace(/'/g, "''");
        const prom = dbutils.updateKeyByValue('copy', changeToJsonString);
        prom.then(function (e) {
            const pullFromDb = dbutils.getValue('copy');
            pullFromDb.then(function (e2) {
                return res.json(JSON.parse(e2));
            })
        }).catch(function () {

        })
    }).catch(function () {
        res.json({});
    });
});














module.exports = router;
