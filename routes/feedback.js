const express = require('express')
const catchAsync = require("../views/utils/catchAsync");
const con = require("../models/ngo");
const router = express.Router({mergeParams: true})


router.post('/', catchAsync((req, res) => {
    // res.send('HELL YES')
    const id = req.params.id
    const rating = req.body.rating
    const body = req.body.body
    let help = 0
    // const stringauthor = req.session.user.username && req.session.user.username.toString();

    let stringauthor = -1
    if(req.session.user.username) {
        stringauthor = req.session.user.username.toString();
    } else if(req.session.user.needyUsername){
        stringauthor = req.session.user.needyUsername.toString();
        help = 1
    }
    // console.log(help)
    // console.log(stringauthor)
    // console.log(req.session.user)
    // console.log(req.body)
    const queryFeedback = `insert into feedbackSchema () values (UUID(), ?, ?, ?, ?, ?)`
    con.query(queryFeedback, [body, rating, id, stringauthor, help], (error, result) => {
        if (error) console.log('\n\n\n\n\nERROR!!!!\n\n\n\n\n' + error)
    })

    req.flash('success', 'Added feedback')
    res.redirect(`/ngos/${id}`)

}))


router.delete('/:feedbackID', catchAsync(async (req, res) => {
    const id = req.params.id
    const feedbackID = req.params.feedbackID
    const queryDeleteFeedback = `DELETE FROM feedbackSchema WHERE feedbackID = ?`

    await con.query(queryDeleteFeedback, [feedbackID], (error, result) => {
        if (error) console.log('\n\n\n\n\nERROR!!!!\n\n\n\n\n' + error)
    })
    res.redirect(`/ngos/${id}`)
}))


module.exports = router


