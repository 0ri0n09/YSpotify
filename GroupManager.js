const userManager = require('./UserManager');
const Group = require('./datas/group')
const groupList = [];

let nextGroupId = 0;

function addGroup(creatorId, groupName) {
    const group = new Group(nextGroupId++, groupName, [creatorId], creatorId);
    groupList.push(group);

    let user = userManager.getUserById(creatorId);
    if (user.currentGroup != null) deleteUserToGroup(user.id, getGroupByID(user.currentGroup));
    user.currentGroup = group.id;
    console.log("Group créé pour " + user.nickname)

}

function deleteGroup(group) {
    const objWithIdIndex = groupList.findIndex((obj) => obj.id === group.id);
    groupList.splice(objWithIdIndex, 1);
}

function getGroupByID(id) {
    const objWithIdIndex = groupList.findIndex((obj) => obj.id == id);
    if(objWithIdIndex === -1) {
        return "404 not found";
    }
    return groupList[objWithIdIndex];
}


// Objet User ainsi qu'un objet group.
function joinGroup(userId, groupId) {

    const User = userManager.getUserById(userId);
    const Group = getGroupByID(groupId);

    if(User.currentGroup == groupId) {
        console.log(User)
        console.log(groupId)
        console.log("Cannot join the group you already joined.");
    }

    if(User.currentGroup != groupId) {
        console.log("Delete old user group")
        console.log(User)
        console.log(groupId)
        if (User.currentGroup != null) deleteUserToGroup(User.id, getGroupByID(User.currentGroup));
        Group.memberList.push(User.id);
        User.currentGroup = groupId;
    }

}

function deleteUserToGroup(user, group) {

    const User = userManager.getUserById(user);

    if(group.memberList.length === 0) {
        deleteGroup(group);
        console.log('Group' + group.name + " has been deleted.");
        return;
    }

    const objWithIdIndex = group.memberList.findIndex((obj) => obj.id === user);
    group.memberList.splice(objWithIdIndex, 1);
    User.currentGroup = null;

    // Gestion groupe.
    if(group.ownerId === user) {
        if(group.memberList.length === 0) {
            deleteGroup(group);
            console.log('Group' + group.name + " has been deleted.");
        } else {
            const random = Math.floor(Math.random() * group.memberList.length);
            group.ownerId = group.memberList[random];
            console.log('Group' + group.name + " has now a new owner named : " + userManager.getUserById(group.ownerId).nickname);
        }
    }
}

module.exports = {
    groupList,
    addGroup,
    deleteGroup,
    joinGroup,
    deleteUserToGroup,
    getGroupByID,
};