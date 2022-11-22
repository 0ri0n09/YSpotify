
// ---- Init ExpressJS ---- //
const express = require('express')
const groupManager = require('./GroupManager.js');
const userManager = require('./UserManager.js')
const app = express()
const json = require ('./users.json');
const port = 3000

app.get('/', (req, res) => {
    groupManager.addGroup(0, "Test 1");
    groupManager.addGroup(1, "Test 2");
    res.send(JSON.stringify(groupManager.groupList));
})

app.get('/group/:id', (req, res) => {
    res.send(JSON.stringify(groupManager.getGroupByID(req.params.id)));
})

app.listen(port, () => {
    json.users.forEach((user) => {
        userManager.userList.push(user);
    });
    console.log(`Example app listening on port ${port}`);
})