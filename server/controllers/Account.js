const models = require('../models');
const Account = models.Account;

const loginPage = (req,res) =>{
    res.render('login', {csrfToken: req.csrfToken()});
};

const chatPage = (req,res) =>{
    res.render('chat', {username: req.session.account.username});
}

const error = (req,res) =>{
    res.render('404page');
}

const logout = (req,res) =>{
    req.session.destroy();
    res.redirect('/');
}

const login = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields required!' });
  }
  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }
    req.session.account = Account.AccountModel.toAPI(account);
    return res.json({ redirect: '/chat' });
  });
};

const signup = (request, response) =>{
    const req = request;
    const res = response;

    req.body.username = `${req.body.username}`;
    req.body.pass = `${req.body.pass}`;
    req.body.pass2 = `${req.body.pass2}`;

    if(!req.body.username || !req.body.pass || !req.body.pass2){
        return res.status(400).json({error: 'All fields are required'});
    }

    if(req.body.pass !== req.body.pass2){
        return res.status(400).json({error: 'Passwords do not match'});
    }

    return Account.AccountModel.generateHash(req.body.pass, (salt, hash) =>{
        const accounData = {
            username: req.body.username,
            salt,
            password: hash,
        };
        const newAccount = new Account.AccountModel(accounData);

        const savePromise = newAccount.save();

        savePromise.then(() => {
            req.session.account = Account.AccountModel.toAPI(newAccount);
            return res.json({redirect: '/chat'});
        });

        savePromise.catch((err) =>{
            console.log(err);

            if(err.code === 11000){
                return res.status(400).json({error: 'Username already in use.'});
            }
            return res.status(400).json({error: 'An error occurred'});
        })
    });
};

const passwordChange = (request, response) => {
    const req = request;
    const res = response;

    req.body.oldPass = `${req.body.oldPass}`;
    req.body.newPass = `${req.body.newPass}`;
    req.body.newPass2 = `${req.body.newPass2}`;

    if(!req.body.oldPass || !req.body.newPass || !req.body.newPass2){
        return res.status(400).json({error: 'All fields are required'});
    }

    if(req.body.newPass !== req.body.newPass2){
        return res.status(400).json({error: 'Passwords do not match'});
    }

    return Account.AccountModel.generateHash(req.body.newPass, (salt, hash) =>{
        
    });
};

const getToken = (request, response) =>{
    const req = request;
    const res = response;

    const csrfJSON = {
        csrfToken: req.csrfToken(),
    };
    res.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.getToken = getToken;
module.exports.signup = signup;
module.exports.chatPage = chatPage;
module.exports.errorPage = error;
module.exports.passChange = passwordChange;