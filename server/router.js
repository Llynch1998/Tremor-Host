const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/', mid.requiresSecure, controllers.Account.main);
  app.get('/chat', mid.requiresSecure, controllers.Account.chatPage);
  app.get('/account', mid.requiresSecure, controllers.Account.account);
  app.post('/passChange', mid.requiresLogin, controllers.Account.passChange);
  app.get('/getMessages', mid.requiresLogin, controllers.Message.loadMessages);
  app.post('/saveMessage', mid.requiresLogin, controllers.Message.saveMessage);
  app.get('/download', mid.requiresSecure, controllers.Account.downloadPage);
  app.get('/getFriends', mid.requiresSecure, mid.requiresLogin, controllers.Friend.getFriends);
  app.get('/addFriend', mid.requiresSecure, mid.requiresLogin, controllers.Friend.add);
};

module.exports = router;
