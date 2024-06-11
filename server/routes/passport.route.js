// import modules
const passport = require('passport');
const router = require('express').Router();

// google auth route
router.get('/google', passport.authenticate('google', 
    {
        scope: ['profile', 'email']
    }
));

router.get('/google/callback', passport.authenticate('google'));

// export route module
module.exports = router;