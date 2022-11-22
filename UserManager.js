const userList = [];
const json = require ('./database.json');
const jwt = require("jsonwebtoken");

function getUserById(id) {
    const objWithIdIndex = userList.findIndex((obj) => obj.id == id);
    if(objWithIdIndex === -1) {
        return "404 not found";
    }
    return userList[objWithIdIndex];
}

//Génération d'un access token
function generateAccessToken (user) {
    return jwt.sign (user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'});
}

//Refresh
function generateRefreshToken (user) {
    return jwt.sign (user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '1h'});
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
    return newUser;
}

module.exports = {
    userList,
    getUserById,
    generateAccessToken,
    generateRefreshToken,
    addUserWithNicknameAndPassword,
};