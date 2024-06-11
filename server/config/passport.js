// import modules
const dotenv = require('dotenv');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { getUserById, insertUser, updateUser } = require('../services/users.service');

// configurations
dotenv.config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback'
        }, (accessToken, refreshToken, profile, done) => {
            console.log('Access Token: ' + accessToken);
            console.log('Refresh Token: ' + refreshToken);
            
            (req, res) => {
                try {
                    const username = profile.name.givenName;
                    const emailAddress = profile.emails[0].value;
                    const imageUrl = profile.photos[0].value;

                    const user = insertUser({ username: username, email_address: emailAddress });
                    updateUser({ email_address: emailAddress, image_url: imageUrl });

                    return done(null, user);
                } catch (error) {
                    return done(error, null);
                }  
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    getUserById(id, (error, results) => {
        if (error) {
            done(error, null);
        } else {
            done(null, results);
        }
    });
}); 

// export module
module.exports = passport;