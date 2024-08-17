export class UserDto {
    id;
    firstname;
    surname;
    phone;
    email;
    role;
    signupDateTime;

    constructor(id, firstname, surname, phone, email, role, signupDateTime) {
        this.id = id;
        this.firstname = firstname;
        this.surname = surname;
        this.phone = phone;
        this.email = email;
        this.role = role;
        this.signupDateTime = signupDateTime;
    }
}