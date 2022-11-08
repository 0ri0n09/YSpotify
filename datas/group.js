class Group {

    constructor(id, name, memberList, ownerName) {
        this.id = id;
        this.name = name;
        this.memberList = memberList;
        this.ownerName = ownerName;
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

    get getOwnerName() {
        return this.ownerName;
    }

    set setOwnerName(newName) {
        this.ownerName = newName;
    }

}