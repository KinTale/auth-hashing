const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const router = express.Router();

const secret = 'absolutesecretKey'
router.post('/register', async (req, res) => {

    const password = req.body.password
    const saltRounds = 10
    const hash = bcrypt.hashSync(password, saltRounds)
    console.log(hash)


    const createUser = await prisma.user.create({
        data: {
            username: req.body.username,
            password: hash
        }
    })
    res.json({ user: createUser })
});


router.post('/login', async (req, res) => {

    const findUser = await prisma.user.findFirst({
        where: {
            username: req.body.username
        }
    })
    //console.log(findUser)
    if (!findUser) {
        res.status(401)
        res.json('user not found')
    }
    const verify = bcrypt.compareSync(req.body.password, findUser.password)
    if (!verify) {
        res.status(401)
        res.json('incorrect password')
    }

    const token = jwt.sign(req.body.username, secret)
    
    res.json({
        verify: verify, // sending this just so i can use in react to change states.
        token: token
    })
   
});

module.exports = router;
