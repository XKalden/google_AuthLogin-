const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');

const keys = require('../config/keys');

const User = mongoose.model('users');


// set cooke to get user ID
passport.serializeUser((user, done) => {
    // user.id is mongoDb id 
    done(null, user.id);

});

// convert cookie back to mongoDB user ID
passport.deserializeUser((id, done) => {

    User.findById(id).then(user => {

        done(null,user);
    });
});




// varify google key and setup callbackURL
passport.use(
    new GoogleStrategy(
        {
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback'
        }, 
        (accessToken, refreshToken, profile, done) => {
            console.log('this is profile', profile);

            User.findOne({ googleId: profile.id}).then((existingUser) => {
                    if(existingUser){
                    // we already have it record with the given profile Id 
                    done(null, existingUser);                    

                    } else {
                    // We don't have a user record wiht the Id, make new records
                        new User({ googleId: profile.id })
                            .save()
                            .then(user => done(null, user));
                            
                             
                    }
                })
        }
    )
);

