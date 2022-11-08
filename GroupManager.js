const groupList = new Array();

function addGroup(creatorName, groupName) {
    const group = new Group(groupList.length + 1, groupName, new Array(), creatorName);
    groupList.push(group);
}

function deleteGroup(group) {
    const objWithIdIndex = groupList.findIndex((obj) => obj.id === group.id);
    groupList.splice(objWithIdIndex, 1);
}

function joinGroup(user, group) {

    if(user.getCurrentGroup()) {
       deleteUserToGroup(user, user.getCurrentGroup());
    }

    group.memberList.push(user.id);
}

function deleteUserToGroup(user, group) {
    const objWithIdIndex = group.memberList.findIndex((obj) => obj.id === user.id);
    group.memberList.splice(objWithIdIndex, 1);

    // Gestion groupe.
    if(group.getOwnerName == user.getName()) {
        if(group.memberList.length == 0) {
            deleteGroup(group);
            console.log('Group' + group.getName() + " has been deleted.");
        } else {
            const random = Math.floor(Math.random() * group.memberList.length);
            group.setOwnerName(group.memberList[random])
            console.log('Group' + group.getName() + " has now a new owner named : " + group.getOwnerName);
        }
    }
}