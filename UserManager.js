const userList = [];

function getUserById(id) {
    return userList.find(x => x.id === id);
}

module.exports = {
    userList,
    getUserById,
};