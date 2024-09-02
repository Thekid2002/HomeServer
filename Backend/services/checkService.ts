import {ValidationError} from "../errors/validationError";

export function checkString(
    key: string,
    value: string,
    allowNull = false,
    minLength: number = 0,
    maxLength: number = 4096
): string {
    if (!allowNull && !value) {
        throw new ValidationError(key + " is not allowed to be empty/null");
    }

    if (value.length < minLength || value.length > maxLength) {
        throw new ValidationError(key + ` must be between ${minLength} and ${maxLength} characters`);
    }

    if (hasIllegalCharacters(value)) {
        throw new ValidationError(key + ` contains illegal characters`);
    }

    return value;
}

export function checkEnum(value: number, $enum: any, allowNull = false): number {
    if (!allowNull && value === null) {
        throw new ValidationError("Value is missing");
    }

    const enumValues = Object.keys($enum).map((key) => (
    $enum[key] as number
    )).splice(Object.keys($enum).length / 2, Object.keys($enum).length - 1);

    if (!enumValues.includes(value)) {
        throw new ValidationError(`Enum ${enumValues} does not contain value: ${value}`);
    }

    return value;
}

export function checkListItem(value: number, list: number[], allowNull = false): number | null {
    if (allowNull && (value === null || isNaN(value))) {
        return null;
    }

    if (!allowNull && value === null) {
        throw new ValidationError("Value is missing");
    }

    if (!list.includes(value)) {
        throw new ValidationError(`Invalid value: ${value} is not in list ${list}`);
    }

    return value;
}

export function checkPhone(phone: string, allowNull = false): string {
    if (!allowNull && phone === null) {
        throw new ValidationError("Phone is missing");
    }

    if (!phone.match(/^[+0-9]*$/)) {
        throw new ValidationError(`Invalid phone: ${phone}`);
    }

    return phone;
}

export function checkEmail(email: string, allowNull = false): string {
    if (!allowNull && email === null) {
        throw new ValidationError("Email is missing");
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        throw new ValidationError(`Invalid email: ${email}`);
    }

    if (hasIllegalCharacters(email)) {
        throw new ValidationError(`Illegal characters in email: ${email}`);
    }

    return email;
}


function hasIllegalCharacters(str: string, pattern = /[^a-zA-Z0-9\s._,!?+@-]/): boolean {
    return pattern.test(str);
}
