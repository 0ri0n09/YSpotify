
// ---- Init ExpressJS ---- //
const express = require('express')
const groupManager = require('./GroupManager.js');
const path = require('path');
const router = express.Router();
const userManager = require('./UserManager.js')
const app = express()
const port = 3000


app.get('/', (req, res) => {
    res.send(JSON.stringify(groupManager.groupList));
})

app.get('/add/:userId/:name', (req, res) => {
    groupManager.addGroup(req.params.id, req.params.name)
    res.redirect('/');
})

app.get('/join/:userId/:name', (req, res) => {
    groupManager.joinGroup(req.params.user, req.params.name)
    res.redirect('/');
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})