const router = require('express').Router();
      login_controller = require('../controllers/loginController');
      signup_controller = require('../controllers/signupController');
/* Home */
router.get('/', (req, res) => {
  // Check if a user is logged-in, is authenticated
  if ( !req.isAuthenticated()) {
    res.redirect('/login')
    return
  }
  res.render('index', {
    title: 'Breakersq',
    user: JSON.stringify(req.user)
  })
})


/* Signup */
router.get('/signup', signup_controller.signup_get);

router.post('/signup', signup_controller.signup_post);


/* Login */
router.get('/login', login_controller.login_get);

router.post('/login', login_controller.login_post);

/* Logout */
router.get('/logout', login_controller.logout_get);


module.exports = router
