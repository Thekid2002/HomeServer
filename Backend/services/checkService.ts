export function checkString(
    value: string,
    allowNull = false,
    minLength: number = 0,
    maxLength: number = 4096
): string {
    if (!allowNull && value === null) {
        throw new Error("Value is missing");
    }

    if (value.length < minLength || value.length > maxLength) {
        throw new Error(`Invalid value: ${value}`);
    }

    if (hasIllegalCharacters(value)) {
        throw new Error(`Illegal characters in value: ${value}`);
    }

    return value;
}

export function checkEnum(value: number, $enum: any, allowNull = false): number {
    if (!allowNull && value === null) {
        throw new Error("Value is missing");
    }

    const enumValues = Object.keys($enum).map((key) => (
    $enum[key] as number
    ));

    if (!enumValues.includes(value)) {
        throw new Error(`Invalid value: ${value}`);
    }

    return value;
}

export function checkListItem(value: number, list: number[], allowNull = false): number | null {
    if(allowNull && (value === null || isNaN(value))) {
        return null;
    }

    if (!allowNull && value === null) {
        throw new Error("Value is missing");
    }

    if (!list.includes(value)) {
        throw new Error(`Invalid value: ${value} is not in list ${list}`);
    }

    return value;
}

export function checkPhone(phone: string, allowNull = false): string {
    if (!allowNull && phone === null) {
        throw new Error("Phone is missing");
    }

    if (!phone.match(/^[+0-9]*$/)) {
        throw new Error(`Invalid phone: ${phone}`);
    }

    return phone;
}

export function checkEmail(email: string, allowNull = false): string {
    if (!allowNull && email === null) {
        throw new Error("Email is missing");
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        throw new Error(`Invalid email: ${email}`);
    }

    if (hasIllegalCharacters(email)) {
        throw new Error(`Illegal characters in email: ${email}`);
    }

    return email;
}


function hasIllegalCharacters(str: string, pattern = /[^a-zA-Z0-9\s.,!?+@-]/): boolean {
    return pattern.test(str);
}