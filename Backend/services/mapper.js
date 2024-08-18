import {UserDto} from "../dto/userDto.js";
import {roleEnumNames} from "../models/role.js";

export function mapUserToUserDto(user) {
    return new UserDto(user.id, user.firstname, user.surname, user.phone, user.email, roleEnumNames[user.role], user.signupDateTime);
}