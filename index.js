require ('dotenv').config ();
const express = require ('express')
const cookieParser = require ("cookie-parser");
const cors = require ("cors");
const request = require ("request");
const querystring = require ("querystring");
const json = require ('./database.json');
const groupManager = require ('./GroupManager.js');
const userManager = require ('./UserManager.js');

const app = express ();
const port = 8000;
app.use (express.json ());
app.use (express.urlencoded ({ extended: true}));
app.use (express.static(__dirname + '/public'))
    .use(cors())
    .use(cookieParser());

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            version: "1.0.0",
            title: "YSpotify API",
            description: "YSpotify API Information",
            contact: {
                name: "Amazing Developer"
            },
            servers: ["http://localhost:8000"]
        }
    },
    apis: ["index.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

let client_id = '414d54457c2d425cbe1da7fba322e20e';
let client_secret = '845f6a341f1f49638377221d7dcde338';
const redirect_uri = 'http://localhost:8000/callback';
let access_token_global = '';
let refresh_token_global = '';

let SpotifyWebApi = require ('spotify-web-api-node');
const { response } = require ("express");
let spotifyApi = new SpotifyWebApi ({
    clientId: client_id,
    clientSecret: client_secret,
    redirectUri: redirect_uri,
});

//Afficher la liste des groupes
/**
 * @swagger
 * /print:
 *  get:
 *    description: Get all informations about groups
 *    responses:
 *      '200':
 *        description: A successful response
 */
app.get('/print', (req, res) => {
    res.send(JSON.stringify(groupManager.groupList));
})

//Ajouter un utilisateur à un groupe
/**
 * @swagger
 * /addGroup:
 *  post:
 *    description: Add user to a specific group
 *    responses:
 *      '200':
 *        description: A successful response
 *      '401':
 *        description: Unauthorized
 *      '404':
 *        description: Not found
 */
app.post('/addGroup', (req, res) => {
    let idUser = req.body.idUser;
    let nameGroup = req.body.groupName;
    //groupManager.addGroup(req.params.id, req.params.name)
    groupManager.addGroup(idUser, nameGroup)
    res.redirect('/print');
})

//Rejoindre un groupe
/**
 * @swagger
 * /join:
 *  post:
 *    description: Join a specific group
 *    responses:
 *      '200':
 *        description: A successful response
 *      '401':
 *        description: Unauthorized
 *      '404':
 *        description: Not found
 */
app.post('/join', (req, res) => {
    let idUser = req.body.idUser;
    let idGroup = req.body.idGroup;
    groupManager.joinGroup(idUser, idGroup)
    res.redirect('/print');
})

//Création d'un user
/**
 * @swagger
 * /createUser:
 *  post:
 *    description: Create a new user
 *    responses:
 *      '200':
 *        description: A successful response
 *      '401':
 *        description: Unauthorized
 */
app.post ('/createUser', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    let currentUser;
    let accessToken;
    let refreshToken;
    let anon = Boolean (true);
    json.users.forEach ((user) => {
        if (req.body.nickname === user.nickname && req.body.password === user.password) {
            console.log ("Utilisateur '" + req.body.nickname + "' existant !\n");
            currentUser = user;
            anon = false;
        }
    });
    if (currentUser === undefined) {
        console.log ("Création de l'utilisateur anonyme...");
        currentUser = userManager.addUserWithNicknameAndPassword (req.body.nickname, req.body.password);
        console.log ("'" + currentUser.nickname + "' ajouté !\n");
    }
    else if (anon === false) {
        accessToken = userManager.generateAccessToken (currentUser);
        refreshToken = userManager.generateRefreshToken (currentUser);
        console.log(currentUser)
    }
    res.send ({
        accessToken,
        refreshToken,
        currentUser,
    });
});

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */

let generateRandomString = function (length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

let stateKey = 'spotify_auth_state';
/**
 * @swagger
 * /login:
 *  get:
 *    description: Use to request a login
 *    responses:
 *      '200':
 *        description: A successful response
 *
 */
app.get ('/login', function(req, res) {
    let state = generateRandomString(16);
    res.cookie (stateKey, state);

    // your application requests authorization
    let scope = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public';
    res.redirect ('https://accounts.spotify.com/authorize?' +
        querystring.stringify ({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
});

/**
 * @swagger
 * /callback:
 *  get:
 *    description: Get a callback from spotify
 *    responses:
 *      '200':
 *        description: A successful response
 */
app.get('/callback', function(req, res) {
    let code = req.query.code || null;
    let state = req.query.state || null;
    let storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {
        res.clearCookie (stateKey);
        let authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer.from (client_id + ':' + client_secret).toString ('base64'))
            },
            json: true
        };
        request.post (authOptions, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                let access_token = body.access_token;
                let refresh_token = body.refresh_token;
                let options = {
                    url: 'https://api.spotify.com/v1/me',
                    headers: { 'Authorization': 'Bearer ' + access_token },
                    json: true
                };
                request.get (options, function(error, response, body) {
                    console.log (body);
                });
                res.redirect('/#' +
                    querystring.stringify({
                        access_token: access_token,
                        refresh_token: refresh_token
                    }));
                access_token_global = access_token;
                refresh_token_global = refresh_token;
            } else {
                res.redirect('/#' +
                    querystring.stringify({
                        error: 'invalid_token'
                    }));
            }
        });
    }
});

//Get les playlists d'un utilisateur
/**
 * @swagger
 * /getUserPlaylists:
 *  get:
 *    description: Get all playlist of an user
 *    responses:
 *      '200':
 *        description: A successful response
 *      '401':
 *        description: Unauthorized
 *      '404':
 *        description: Not found
 */
app.get('/getUserPlaylists', function(req, res) {
    let state = generateRandomString (16);
    res.cookie(stateKey, state);
    let scope = 'playlist-read-private';
    res.redirect('https://api.spotify.com/v1/me/playlists?' +
        querystring.stringify({
            access_token: access_token_global,
            token_type: 'Bearer',
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
});

//Ajouter des pistes à une playlist
/**
 * @swagger
 * /addTrack:
 *  post:
 *    description: Add track to a playlist
 *    responses:
 *      '200':
 *        description: A successful response
 *      '401':
 *        description: Unauthorized
 *      '404':
 *        description: Not found
 */
app.post('/addTrack', function(req, res) {
    spotifyApi.setAccessToken (access_token_global);
    let playlistId = JSON.stringify (req.body.playlistId);
    let tracks = JSON.stringify (req.body.tracks);
    //let tracks = [ ];
    tracks.concat (JSON.stringify (req.body.tracks));
    //spotifyApi.addTracksToPlaylist('3l06nffNmSPAnU1B2RcJkl', ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh", "spotify:track:1301WleyT98MSxVHPZCA6M"])
    spotifyApi.addTracksToPlaylist (playlistId, tracks)
        .then(function (data) {
            console.log ('Pistes ajoutées !');
            console.log (data.body);
            res.send (data.body);
        }, function (err) {
            console.log('Erreur: ', err);
        });
});

//Créer une playlist
/**
 * @swagger
 * /addPlaylist:
 *  post:
 *    description: Create playlist
 *    responses:
 *      '200':
 *        description: A successful response
 *      '401':
 *        description: Unauthorized
 *      '404':
 *        description: Not found
 */
app.post('/addPlaylist', function(req, res) {
    spotifyApi.setAccessToken (access_token_global);
    let name = req.body.name;
    let options = {
        description: req.body.description,
        public: req.body.public
    };
    //spotifyApi.createPlaylist(name, {'description': 'My description', 'public': true})
    spotifyApi.createPlaylist (name, options)
        .then(function (data) {
            console.log ('Playlist Créee');
            console.log (data.body);
            res.send (data.body);
        }, function (err) {
            console.log ('Erreur: ', err);
        });
});

//User
/**
 * @swagger
 * /addPlaylist:
 *  get:
 *    description: Get informations about yourself
 *    responses:
 *      '200':
 *        description: A successful response
 *      '401':
 *        description: Unauthorized
 *      '404':
 *        description: Not found
 */
app.get('/me', function(req, res) {
    spotifyApi.setAccessToken (access_token_global);
    spotifyApi.getMe()
        .then(function (data) {
            console.log (data.body);
            res.send (data.body);
        }, function (err) {
            console.log('Something went wrong!', err);
        });
});

app.listen(port, () => {
        json.users.forEach((user) => {
            userManager.userList.push(user);
        });
        json.groups.forEach((group) => {
            groupManager.groupList.push(group);
        });
        console.log(`Example app listening on port ${port}`);
    })