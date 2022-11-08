const userList = new Array();

function getUserById(id) {
    const user = userList.find(x => x.id === id);
    return user;
}