class User {

    constructor(id, nickname, password, token, currentGroup) {
        this.id = id;
        this.nickname = nickname;
        this.password = password;
        this.token = token;
        this.currentGroup = currentGroup;
    }

    get getId() {
        return this.id;
    }

    get getNickname() {
        return this.nickname;
    }

    get getPassword() {
        return this.password;
    }
    
    get getToken() {
        return this.token;
    }

    set setNickname(newName) {
        this.nickname = newName;
    }

    set setPassword(newPassword) {
        this.password = newPassword;
    }

    set setToken(newToken) {
        this.token = newToken;
    }

    get getCurrentGroup() {
        return this.currentGroup;
    }
}
