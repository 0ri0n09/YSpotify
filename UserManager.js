const userList = [];

export function getUserById(id) {
    return userList.find(x => x.id === id);
}