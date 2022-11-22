const userList = [];
const json = require ('./users.json');
const jwt = require("jsonwebtoken");

function getUserById (id) {
    return userList.find(x => x.id === id);
}

//Génération d'un access token
function generateAccessToken (user) {
    return jwt.sign (user, user.token, {expiresIn: '1h'});
}

//Refresh
function generateRefreshToken (user) {
    return jwt.sign (user, user.token, {expiresIn: '1h'});
}

//Ajouter un nouvel utilisateur
function addUserWithNicknameAndPassword (newNickname, newPassword) {
    let newUser = {
        'nickname': newNickname,
        'password': newPassword,
        'token': null,
        "currentGroup": null,
        "spotifyNickname": null
    }
    newUser["token"] = generateAccessToken (newUser);
    json.users.push (newUser);
}

module.exports = {
    userList,
    getUserById,
    generateAccessToken,
    generateRefreshToken,
};