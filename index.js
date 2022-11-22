
// ---- Init ExpressJS ---- //
const express = require('express')
const groupManager = require('./GroupManager.js');
const userManager = require('./UserManager.js')
const json = require ('./database.json');
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send(JSON.stringify(groupManager.groupList));
})

app.get('/group/:id', (req, res) => {
    res.send(JSON.stringify(groupManager.getGroupByID(req.params.id)));
})

app.get('/user/:id', (req, res) => {
    res.send(JSON.stringify(userManager.getUserById(req.params.id)));
})

app.get('/add/:id/:name', (req, res) => {
    groupManager.addGroup(req.params.id, req.params.name)
    res.redirect('/');
})

app.get('/join/:user/:name', (req, res) => {
    groupManager.joinGroup(req.params.user, req.params.name)
    res.redirect('/');
})

app.listen(port, () => {
    json.users.forEach((user) => {
        userManager.userList.push(user);
    });
    json.groups.forEach((group) => {
        groupManager.groupList.push(group);
    });
    console.log(`Example app listening on port ${port}`);
})