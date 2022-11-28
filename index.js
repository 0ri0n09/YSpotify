    const jwt = require ('jsonwebtoken');
    const json = require ('./database.json');
    require ('dotenv').config ();
    const express = require('express')
    const groupManager = require ('./GroupManager.js');
    const userManager = require ('./UserManager.js');
    const {generateAccessToken} = require("./UserManager");
    const app = express ();
    const port = 3000;
    app.use (express.json ());
    app.use (express.urlencoded ({ extended: true}));

    app.get ('/', (req, res) => {
        res.send(JSON.stringify(groupManager.groupList));
    })
z

    app.post('/addgroup/', function (req, res) {
        groupManager.addGroup(req.params.id, req.params.name)
    })


    app.get('/join/:user/:name', (req, res) => {
        groupManager.joinGroup(req.params.user, req.params.name)
        res.redirect('/');
    })

    app.listen(port, () => {
        json.users.forEach((user) => {
            userManager.userList.push(user);
            console.log('User ' + user.nickname + " added to cache successfuly.")
        });
        json.groups.forEach((group) => {
            groupManager.groupList.push(group);
            console.log('Group ' + group.name + " added to cache successfuly.")
        });

        console.log(`Example app listening on port ${port}`);
    })

    //Login d'un user
    app.post ('/api/login', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        let currentUser;
        let accessToken;
        let refreshToken;
        let anon = Boolean (true);
        json.users.forEach ((user) => {
            if (req.body.nickname === user.nickname && req.body.password === user.password) {
                console.log ("Utilisateur connu...");
                currentUser = user;
                anon = false;
            }
        });
        if (currentUser === undefined) {
            console.log ("Création de l'utilisateur anonyme...");
            currentUser = userManager.addUserWithNicknameAndPassword (req.body.nickname, req.body.password);
        }
        else if (anon === false) {
            accessToken = userManager.generateAccessToken (currentUser);
            refreshToken = userManager.generateRefreshToken (currentUser);
        }
        res.send ({
            accessToken,
            refreshToken,
        });
    });

    //Refresh du token
    app.post ('/api/refreshToken', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split (' ')[1];
        if (!token) {
            return res.sendStatus (401);
        }

        jwt.verify (token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus (401);
            }
            delete user.iat;
            delete user.exp;
            const refreshedToken = generateAccessToken (user);
            res.send ({
                accessToken: refreshedToken,
            });
        });
    });

    //Token d'authentification
    function authenticateToken (req, res, next) {
        res.setHeader('Content-Type', 'application/json');
        const authHeader = req.headers ['authorization'];
        const token = authHeader && authHeader.split (' ')[1];

        if (!token) {
            return res.sendStatus (401);
        }

        jwt.verify (token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus (401);
            }
            req.user = user;
            next();
        });
    }

    //Accès aux posts
    app.get ('/api/posts', authenticateToken, (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        if (req.user.admin === false) {
            posts.forEach ((post) => {
                if (req.user.id === post.author) {
                    res.send (post);
                }
            });
        }
        else {
            res.send (posts);
        }
    });