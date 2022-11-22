const userList = [];

function getUserById(id) {
    const objWithIdIndex = userList.findIndex((obj) => obj.id == id);
    if(objWithIdIndex === -1) {
        return "404 not found";
    }
    return userList[objWithIdIndex];
}

module.exports = {
    userList,
    getUserById,
};