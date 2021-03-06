var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');
var fileUpload = require('express-fileupload');

var uploadRouter = require('./routes/fileUpload');
var libraryRouter = require('./routes/library');
var hederaRouter = require('./routes/hedera');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));
app.use(fileUpload());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/foundation', hederaRouter);
app.use('/foundation/fund', hederaRouter);
app.use('/foundation/getAccountInfo', hederaRouter);
app.use('/foundation/createAccounts', hederaRouter);
app.use('/foundation/executeNFTTokenCreationForTreasury', hederaRouter);
app.use('/foundation/getAccountBalanceTreasury', hederaRouter);
app.use('/foundation/createDailySupply', hederaRouter);
app.use('/foundation/createFungibleToken', hederaRouter);
app.use('/foundation/setNewCustomFixedFee', hederaRouter);
app.use('/uploadPapers', uploadRouter);
app.use('/uploadPapers/upload', uploadRouter);
app.use('/library', libraryRouter);
app.use('/library/search', libraryRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
