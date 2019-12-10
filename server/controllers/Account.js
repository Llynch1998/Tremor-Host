const models = require('../models');
const Account = models.Account;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const chatPage = (req, res) => {
  res.render('chat', { username: req.session.account.username });
};

const accountPage = (req, res) => {
  res.render('account', { username: req.session.account.username });
};

const error = (req, res) => {
  res.render('404page');
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/login');
};

const main = (req, res) => {
  res.render('main', { csrfToken: req.csrfToken() });
};

const downloadPage = (req, res) => {
  res.render('download');
};

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

const signup = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accounData = {
      username: req.body.username,
      salt,
      password: hash,
    };
    const newAccount = new Account.AccountModel(accounData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/chat' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }
      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};

const passwordChange = (request, response) => {
  const req = request;
  const res = response;


  const currentPassword = req.body.currPass;
  const newPass = req.body.newPass;
  const newPass2 = req.body.newPass2;

  if (!currentPassword || !newPass || !newPass2) {
    return res.status(400).json({ error: 'Please Fill In All Fields' });
  }

  if(req.body.newPass !== req.body.newPass2){
    return res.status(400).json({error: 'Yah passwords do not match'});
  }

  if(req.body.currentPassword === req.body.newPass){
    return res.status(400).json({error: 'Your New password cannot be your old password'});
  };

  return Account.AccountModel.authenticate(`${req.session.account.username}`, currentPassword,
    (err, pass) => {
      if (err || !pass) {
        return res.status(401).json({ error: 'The current password is incorrect' });
      }

      return Account.AccountModel.generateHash(newPass, (salt, hash) => {
        const searchUser = {
          username: req.session.account.username,
        };
        //is saying error is defined error in upper scope?
        // eslint-disable-next-line error-type
        Account.AccountModel.update(searchUser, { $set: { password: hash, salt } }, (error) => {
          if (error) {
            return res.status(500).json({ error: 'The password cannot be updated' });
          }

          return res.status(200).json({ redirect: '/account' });
        });
      });
    }
  );
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };
  res.json(csrfJSON);
};

const findUser = (request, response) =>{
  const req = request;
  const res = response;

  return Account.AccountModel.findByUsername(req.name, (err,docs) =>{
    if(err) { 
        console.log(err);
        return res.status(400).json({error: 'An error ocurred'});
    }
    return res.json({username: docs});
  }
  
}

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.getToken = getToken;
module.exports.signup = signup;
module.exports.chatPage = chatPage;
module.exports.errorPage = error;
module.exports.passChange = passwordChange;
module.exports.account = accountPage;
module.exports.main = main;
module.exports.downloadPage = downloadPage;
module.exports.findUser = findUser;
