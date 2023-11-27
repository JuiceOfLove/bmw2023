export default class UserDto {
    constructor(model) {
        this.email = model.email;
        this.id = model.id;
        this.fullName = model.fullName;
        this.isActivated = model.isActivated;
        this.role = model.role;
        this.departament = model.departament;
        this.avatarUrl = model.avatarUrl;
    }
}
