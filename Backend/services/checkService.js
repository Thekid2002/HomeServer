export function checkString(value, minLength = 0, maxLength = 4096) {
    if (value.length < minLength || value.length > maxLength) {
        throw new Error(`Invalid value: ${value}`);
    }

    return value;
}

export function checkPhone(phone) {
    if (!phone.match(/[0-9]*/)) {
        throw new Error(`Invalid phone: ${phone}`);
    }

    return phone;
}

export function checkEmail(email) {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        throw new Error(`Invalid email: ${email}`);
    }

    return email;
}