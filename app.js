var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var dbutils = require('./utils/dbUtils');
var memoryCache = require('memory-cache');


var index = require('./routes/index');

var app = express();

app.engine('hbs', exphbs({defaultLayout: 'layout'}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('combined', { skip: function (req, res) { return res.statusCode < 400 } } ));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(require('./routes/index'))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.listen(3000,'127.0.0.1', function(){
    console.log('server startup local listening and loading cache');
    const localCacheProm = dbutils.getLocalCache();
    localCacheProm.then(function(cache){
        Object.keys(cache || {}).forEach(function(key){
            memoryCache.put(key, cache[key]);
        });
    })
});



module.exports = app;
