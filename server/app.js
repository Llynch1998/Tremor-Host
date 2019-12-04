const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const url = require('url');
const csrf = require('csurf');
const port = process.env.PORT || process.env.NODE_PORT || 3000;
const app = express();
// eslint-disable-next-line new-cap
const http = require('http').Server(app);
const io = require('socket.io')(http);
const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/DomoMaker';

const currentUsers = [];

mongoose.connect(dbURL, (err) => {
  if (err) {
    console.log('Could not connect to database');
    throw err;
  }
});

let redisURL = {
  hostname: 'redis-17995.c15.us-east-1-4.ec2.cloud.redislabs.com',
  port: '17995',
};

let redisPass = 'fOrInnzk9aMVn1nLinQCGU4W2XqZaUI8';

if (process.env.REDISCLOUD_URL) {
  redisURL = url.parse(process.env.REDISCLOUD_URL);
  redisPass = redisURL.auth.split(':')[1];
}

const router = require('./router.js');


app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted`)));
app.use(favicon(`${__dirname}/../hosted/img/TremorIcon.png`));
app.disable('x-powered-by');
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  key: 'sessionid',
  store: new RedisStore({
    host: redisURL.hostname,
    port: redisURL.port,
    pass: redisPass,
  }),
  secret: 'Domo Arigato',
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
  },
}));
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);
app.use(cookieParser());
app.use(csrf());
app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);
  console.log('Missing CSRF token');
  return false;
});

router(app);
app.use((req, res) => {
  res.status(404).render('404Page');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
    console.log(`message: ${msg}`);
  });
});

io.on('connection', (socket) => {
  socket.on('joined', (name) => {
    console.log(name);
    // eslint-disable-next-line no-param-reassign
    socket.nickname = name;
    currentUsers.push(socket.nickname);
    console.log(currentUsers);
    io.sockets.emit('userAdded', currentUsers);
  });
  socket.on('disconnect', () => {
    console.log(socket.nickname);
    console.log(currentUsers.indexOf(socket.nickname));
    currentUsers.splice(currentUsers.indexOf(socket.nickname), 1);
    io.emit('userAdded', currentUsers);
  });
});

http.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});


module.exports.io = io;
