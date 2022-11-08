class Assessment {

    constructor(userId, attrait, agitation, preference, attitude) {
        this._userId = userId;
        this._attrait = attrait;
        this._agitation = agitation;
        this._preference = preference;
        this._attitude = attitude;
    }

    get getUserId() {
        return this._userId;
    }

    set setUserId(value) {
        this._userId = value;
    }

    get getAttrait() {
        return this._attrait;
    }

    set setAttrait(value) {
        this._attrait = value;
    }

    get getAgitation() {
        return this._agitation;
    }

    set setAgitation(value) {
        this._agitation = value;
    }

    get getPreference() {
        return this._preference;
    }

    set setPreference(value) {
        this._preference = value;
    }

    get getAttitude() {
        return this._attitude;
    }

    set setAttitude(value) {
        this._attitude = value;
    }
}