const passport = require('passport');

exports.login_get = (req, res) => {
  if (req.isAuthenticated()) return res.redirect('/')

  res.render('login', { title: 'login' })
};

exports.login_post = [passport.authenticate('custom', {  failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  }]


exports.logout_get = (req, res) => {
  req.session.destroy();
  req.logout()
  res.redirect('/')
};
