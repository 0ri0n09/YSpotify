class User {

    constructor(nickname, password, token) {
        this.nickname = nickname;
        this.password = password;
        this.token = token;
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
}
