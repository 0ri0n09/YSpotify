const userManager = require('./UserManager');
const Group = require('./datas/group')
const Console = require("console");
const groupList = [];

let nextGroupId = 0;

function addGroup(creatorId, groupName) {
    const group = new Group(nextGroupId++, groupName, [], creatorId);
    groupList.push(group);
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

    if(user.getCurrentGroup())
       deleteUserToGroup(user, user.getCurrentGroup());

    group.memberList.push(user.id);
}

function deleteUserToGroup(user, group) {
    const objWithIdIndex = group.memberList.findIndex((obj) => obj.id === user.id);
    group.memberList.splice(objWithIdIndex, 1);

    // Gestion groupe.
    if(group.getOwnerId === user.getId()) {
        if(group.memberList.length === 0) {
            deleteGroup(group);
            console.log('Group' + group.getName() + " has been deleted.");
        } else {
            const random = Math.floor(Math.random() * group.memberList.length);
            group.setOwnerId(group.memberList[random])
            console.log('Group' + group.getName() + " has now a new owner named : " + userManager.getUserById(group.getOwnerId).getNickname());
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