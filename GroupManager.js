const userManager = require('./UserManager');
const Group = require('./datas/group')
const groupList = [];

let nextGroupId = 0;

function addGroup(creatorId, groupName) {
    const group = new Group(nextGroupId++, groupName, [], creatorId);
    groupList.push(group);

    let user = userManager.getUserById(creatorId);

    group.memberList.push(user.id);
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

function joinGroup(user, group) {

    if(user.currentGroup)
       deleteUserToGroup(user, user.currentGroup);

    group.memberList.push(user.id);
}

function deleteUserToGroup(user, group) {

    if(group.memberList.length === 0) {
        deleteGroup(group);
        console.log('Group' + group.getName() + " has been deleted.");
        return;
    }

    const objWithIdIndex = group.memberList.findIndex((obj) => obj.id === user.id);
    group.memberList.splice(objWithIdIndex, 1);

    // Gestion groupe.
    if(group.ownerId === user.id) {
        if(group.memberList.length === 0) {
            deleteGroup(group);
            console.log('Group' + group.getName() + " has been deleted.");
        } else {
            const random = Math.floor(Math.random() * group.memberList.length);
            group.ownerId = group.memberList[random];
            console.log('Group' + group.getName() + " has now a new owner named : " + userManager.getUserById(group.ownerId).nickname());
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