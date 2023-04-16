const express = require('express')
const catchAsync = require("../views/utils/catchAsync");
const con = require("../models/ngo");
const router = express.Router()
const { v4: UUID } = require('uuid');

router.get('/', catchAsync(async (req, res) => {

    const sql = `SELECT * FROM ngoSchema`
    await con.query(sql, (error, result) => {
        if (error) console.log('\n\n\n\n\nERROR!!!!\n\n\n\n\n' + error)
        res.render('ngos/index', {ngos: result})
    })
}))

router.get('/new', (req, res) => {
    res.render('ngos/new')
})

router.post('/', catchAsync(async (req, res) => {
    if (!req.body.title) throw new ExpressError('Invalid NGO data', 400)
    const title = req.body.title
    const description = req.body.description
    const location = req.body.location
    const id = UUID()

    const queryAdd = `insert into ngoSchema (id, title, description, location) values (?, ?, ?, ?)`
    await con.query(queryAdd, [id, title, description, location], (error, result) => {
        if (error) console.log('\n\n\n\n\nERROR!!!!\n\n\n\n\n' + error)
        req.flash('success', 'Added new ngo')
        res.redirect(`/ngos/${id}`)
    })

}))

router.get('/:id', catchAsync(async (req, res) => {
    const ngoID = await req.params.id
    const queryShow = `SELECT * from ngoSchema where id = ?`
    const queryFeedback = `SELECT * from feedbackSchema where ngoid = ?`

    await con.query(queryShow, [ngoID], (error, nResult) => {
        if (error) {
            return res.status(500).send(error);
        }
        con.query(queryFeedback, [ngoID], (error, fResult) => {
            if (error) {
                return res.status(500).send(error);
            }
            res.render('ngos/show', {ngo: nResult[0], feedback: fResult})
        })
    })
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const id = req.params.id
    const queryShow = `SELECT * from ngoSchema where id = ?`

    await con.query(queryShow, [id], (error, result) => {
        if (error) {
            return res.status(500).send(error)
        }
        res.render('ngos/edit', {ngo: result[0]})
    })
}))

router.post('/:id', catchAsync(async (req, res) => {
    const id = req.params.id
    const title = req.body.title
    const description = req.body.description
    const location = req.body.location
    // console.log(req.body)
    const queryUpdate = `UPDATE ngoSchema set title = ?, description = ?, location = ? where id = ?`
    await con.query(queryUpdate, [title, description, location, id], (error, result) => {
        if (error) {
            return res.status(500).send(error)
        }
        req.flash('success', 'Updated ngo')
        res.redirect(`/ngos/${id}`)
    })
}))


router.delete('/:id', catchAsync(async (req, res) => {
    const id = req.params.id
    const queryDelete = `DELETE FROM ngoSchema WHERE id = ?`
    const queryDeleteFeedback = `DELETE FROM feedbackSchema WHERE ngoID = ?`

    await con.query(queryDeleteFeedback, [id], (error, result) => {
        if (error) console.log('\n\n\n\n\nERROR!!!!\n' + error)
        con.query(queryDelete, [id], (error, result) => {
            res.redirect('/ngos')
        })
    })
}))

module.exports = router


