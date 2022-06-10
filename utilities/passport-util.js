const CustomStrategy = require('passport-custom').Strategy,
      User  = require('../models/user')
      snarkjs = require("snarkjs")
      fs = require("fs");
module.exports = (app, passport) => {
  passport.use(new CustomStrategy(
  async function(req, done) {
    if(!req.body.publicSignals) return await done(null,false);
    else {
      const vKey = JSON.parse(fs.readFileSync("./public/circuit_js/verification_key.json"));
      const res = await snarkjs.plonk.verify(vKey, req.body.publicSignals, req.body.proof)
      if(req.body.publicSignals[0]==='0' && res) {
        return await done(null, req.body.proof);
      }
      else return await done(null,false);
    }
  }
  ));
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
  app.use(passport.initialize())
  app.use(passport.session())
}
