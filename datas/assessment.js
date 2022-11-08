class Assessment {

    constructor(userId, attrait, agitation, preference, attitude) {
        this._userId = userId;
        this._attrait = attrait;
        this._agitation = agitation;
        this._preference = preference;
        this._attitude = attitude;
    }

    get userId() {
        return this._userId;
    }

    set userId(value) {
        this._userId = value;
    }

    get attrait() {
        return this._attrait;
    }

    set attrait(value) {
        this._attrait = value;
    }

    get agitation() {
        return this._agitation;
    }

    set agitation(value) {
        this._agitation = value;
    }

    get preference() {
        return this._preference;
    }

    set preference(value) {
        this._preference = value;
    }

    get attitude() {
        return this._attitude;
    }

    set attitude(value) {
        this._attitude = value;
    }
}