// ---- Init ExpressJS ---- //
const express = require('express')
const groupManager = require('./GroupManager.js');
const userManager = require('./UserManager.js')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send(JSON.stringify(groupManager.groupList));
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})