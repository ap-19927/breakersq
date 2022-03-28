const User = require('../models/user');
const fsLibrary  = require('fs');
exports.signup_get = (req, res) => {
  if (req.session.challenge) return res.redirect('/')
  res.render('signup', { title: 'Signup' })
};

exports.signup_post = async (req, res, next) => {
  //console.log(req.body.publicKey)
  fsLibrary.writeFile('./public/verify.txt', req.body.publicKey+'\n', { flag: 'a' }, (error) => {
    // In case of a error throw err exception.
    if (error) console.error(error);
  })
  // Create an USER object with escaped and trimmed data.
  const user = new User(
    {
      public_key: req.body.publicKey
    }
  );
  user.save(function (err) {
    if (err) { return next(err); }
    // Successful - redirect to index
    res.redirect('/login');
  });
}
