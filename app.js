var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var session = require("express-session")({
  secret:"keyboard cat",
  cookie:{maxAge:800000},
});

var iosession = require("express-socket.io-session")(session); //

var app = express();

//app ~ server ~ io(socket.io)
var server = require("http").Server(app);  //app与http服务器进行关联
var io = require("socket.io")(server);  //socket.io与http服务器进行关联
server.listen(3000);

let firstSocket;
io.use(iosession);
//监听请求
io.on("connection",function (socket) {  //每一次被调用的时候socket都是一个全新的对象
  //only test
  // if(firstSocket){  //如果有的话，说明已经被赋值过了
  //   console.log("firstSocket === socket",firstSocket === socket);
  // }else{
  //   firstSocket = socket;
  // }

  socket.on("req",function (data,cb) {  //第二个参数增加一个回调函数可以给客户端一个响应
    console.log("接收到请求");
    cb(data+"go out!"); //响应
  })

  socket.on("say",data=>{
    const num = ++socket.handshake.session.num;
    socket.handshake.session.save();
    // io.emit("newsay",data + "(创建时间：" + new Date() + ")");  //将socket改成io可以返回给当前连接服务器的所有socket
    io.emit("newsay",data + "num = " + num);
  })

});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

// module.exports = app;
