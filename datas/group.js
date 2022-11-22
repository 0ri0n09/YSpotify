class Group {

    constructor(id, name, memberList, ownerId) {
        this.id = id;
        this.name = name;
        this.memberList = memberList;
        this.ownerId = ownerId;
    }

    get getId() {
        return this.id;
    }

    get getName() {
        return this.name;
    }

    set setName(newName) {
        this.name = newName;
    }

    get getMemberList() {
        return this.memberList;
    }

    get getMemberCount() {
        return this.memberList.length;
    }

    get getOwnerId() {
        return this.ownerId;
    }

    set setOwnerId(newId) {
        this.ownerId = newId;
    }
}

module.exports = Group;