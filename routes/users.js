const express = require('express')
const router = express.Router()
const con = require('../models/ngo')
const bcrypt = require('bcrypt');
const catchAsync = require("../views/utils/catchAsync");

router.get('/register', (req, res) => {
    res.render('users/register')
})


router.post('/register', catchAsync(async (req, res) => {
    try {
        const {username, email, password} = req.body
        const queryAdd = `insert into userSchema (userID, username, password, email) values (UUID(), ?, ?, ?)`

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) throw err;
            // Insert the user into the database
            con.query(queryAdd, [username, hashedPassword, email], (err, results) => {
                if (err) throw err;
                req.flash('success', 'welcome')
                res.redirect(`/ngos`)
            });
        });
    } catch (e) {
        req.flash('error', e.message)
        res.redirect(`/register`)
    }
}))


router.get('/login', (req, res) => {
    res.render('users/login')
})
router.post('/login', (req, res) => {

    const {username, password} = req.body;
    const querySelect = `SELECT * FROM userSchema WHERE username = ?`;

    con.query(querySelect, [username], (err, results) => {
        if (err) {
            console.error('Error querying database: ', err);
            res.redirect('/login');
        } else {
            if (results.length > 0) {
                const user = results[0];
                bcrypt.compare(password, user.password, (e, result) => {
                    if (err) {
                        console.error('Error comparing passwords: ', err);
                        res.redirect('/login');
                    } else {
                        if (result) {
                            req.session.user = user; // set the session variable
                            req.flash('success', 'Welcome back to Be Social')
                            res.redirect('/ngos')
                        } else {
                            console.log('Invalid email or password!');
                        }
                    }
                });
            } else {
                console.log('Invalid email or password!');
            }
        }
    });
});

router.get('/logout', (req, res) => {
    // Clear the user session
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session: ', err);
        } else {
            // Clear the cookie containing the session ID
            res.clearCookie('connect.sid');
            // Redirect the user to the login page
            res.redirect('/ngos');
        }
    });
});


/////////////////////////////////////needy people

router.get('/needhelp', (req, res) => {
    res.render('users/needhelp')
})

router.post('/needhelp', catchAsync(async (req, res) => {
    try {
        const {needyUsername, email, password} = req.body
        const queryAdd = `insert into needypeopleSchema (needyUserID, needyUsername, password, email) values (UUID(), ?, ?, ?)`

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) throw err;
            con.query(queryAdd, [needyUsername, hashedPassword, email], (err, results) => {
                if (err) throw err;
                req.flash('success', 'Feed free to contact')
                res.redirect(`/ngos`)
            });
        });
    } catch (e) {
        req.flash('error', e.message)
        res.redirect(`/needhelp`)
    }
}))


router.get('/needhelplogin', (req, res) => {
    res.render('users/needhelplogin')
})

router.post('/needhelplogin', (req, res) => {
    // console.log(req.body)
    const {needyUsername, password} = req.body
    const querySelect = `SELECT * FROM needypeopleSchema WHERE needyUsername = ?`;

    con.query(querySelect, [needyUsername], (err, results) => {
        if (err) {
            console.error('Error querying database: ', err);
            res.redirect('/needhelplogin');
        } else {

            if (results.length > 0) {
                const user = results[0];
                bcrypt.compare(password, user.password, (e, result) => {
                    if (err) {
                        console.error('Error comparing passwords: ', err);
                        res.redirect('/needhelplogin');
                    } else {
                        if (result) {
                            req.session.user = user; // set the session variable
                            req.flash('success', 'Welcome back to Be Social, feel free to ask for help')
                            res.redirect('/ngos')
                        } else {
                            console.log(result)
                            console.log('Invalid email or password!');
                        }
                    }
                });
            } else {
                console.log('Invalid or password!');
            }
        }
    });
})


module.exports = router
