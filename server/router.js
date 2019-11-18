const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) =>{
    app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
    app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
    app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
    app.get('/getDomos', mid.requiresLogin, controllers.Domo.getDomos);
    app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
    app.get('/logout',  mid.requiresLogin, controllers.Account.logout);
    app.get('/maker', mid.requiresLogin, controllers.Domo.makerPage);
    app.post('/maker', mid.requiresLogin, controllers.Domo.make);
    app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
    app.get('/chat', mid.requiresSecure, controllers.Account.chatPage);
    //app.post('/passChange', mid.requiresSecure, controllers.Account.passChange);
}

module.exports = router;