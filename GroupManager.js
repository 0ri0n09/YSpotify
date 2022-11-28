const userManager = require('./UserManager');
const Group = require('./datas/group')
const groupList = [];

let nextGroupId = 0;

function addGroup(creatorId, groupName) {
    const group = new Group(nextGroupId++, groupName, [], creatorId);
    groupList.push(group);

    let user = userManager.getUserById(creatorId);
    joinGroup(user, group);
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
function joinGroup(user, group) {

    if(user.currentGroup != group.id) {
        console.log("Delete old user group")
        if (user.currentGroup != null) deleteUserToGroup(user.id, getGroupByID(user.currentGroup));
        group.memberList.push(user.id);
        user.currentGroup = group.id;
    }

    if(user.currentGroup == group.id) {
        console.log("Cannot join the group you already joined.");
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
    joinGroup,
    deleteUserToGroup,
    getGroupByID,
};