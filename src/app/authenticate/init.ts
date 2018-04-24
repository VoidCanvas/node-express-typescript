const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

import { User } from '../models';

export const initAuth = (app:any) => {
  app.use(passport.initialize());
  app.use(passport.session());
  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to login
    failureFlash : true, // allow flash messages,
  }));
};

async function login(username: string, password: string, done:Function): Promise<void> {
  const user = await User.invalidate({ password, email:username });
  if (user) {
    return done(null, user); 
  }
  done(null, false);
}
passport.serializeUser((user:any, done:any) => {
  done(null, user.id);
});

passport.deserializeUser((id:any, done:any) => {
  User.findById(id)
  .then((user) => {
    done(null, user);    
  });
});
passport.use('local-login', new LocalStrategy(login));

