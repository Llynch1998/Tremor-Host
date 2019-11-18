const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) =>{
    app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
    app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
    app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
    app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
    app.get('/logout',  mid.requiresLogin, controllers.Account.logout);
    app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
    app.get('/chat', mid.requiresSecure, controllers.Account.chatPage);
    app.get('/account', mid.requiresSecure, controllers.Account.account);
    app.post('/passChange', mid.requiresSecure, controllers.Account.passChange);
}

module.exports = router;