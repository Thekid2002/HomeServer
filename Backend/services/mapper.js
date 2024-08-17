import {UserDto} from "../dto/userDto.js";

export function mapUserToUserDto(user) {
    return new UserDto(user.id, user.firstname, user.surname, user.phone, user.email, user.role, user.signupDateTime);
}