const CustomStrategy = require('passport-custom').Strategy,
      User  = require('../models/user')
      snarkjs = require("snarkjs")
      fs = require("fs");
const p = 218882246405698295617n;
module.exports = (app, passport) => {
  passport.use(new CustomStrategy(
  async function(req, done) {
    if(!req.body.publicKey) return await done(null,false);
    else {
      const { proof, publicSignals } =
        await snarkjs.plonk.fullProve( { a: req.body.publicKey, b: req.body.line, d: -1}, "circuit.wasm", "circuit_final.zkey");

      const vKey = JSON.parse(fs.readFileSync("verification_key.json"));

      const res = await snarkjs.plonk.verify(vKey, publicSignals, proof);
      //console.log(JSON.stringify(proof))
      if(res) return await done(null, proof);
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
