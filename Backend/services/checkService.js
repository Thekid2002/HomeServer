export function checkString(value, allowNull = false, minLength = 0, maxLength = 4096) {
    if (!allowNull && value === null) {
        throw new Error('Value is missing');
    }

    if (value.length < minLength || value.length > maxLength) {
        throw new Error(`Invalid value: ${value}`);
    }

    return value;
}

export function checkPhone(phone, allowNull = false) {
    if (!allowNull && phone === null) {
        throw new Error('Phone is missing');
    }

    if (!phone.match(/[0-9]*/)) {
        throw new Error(`Invalid phone: ${phone}`);
    }

    return phone;
}

export function checkEmail(email, allowNull = false) {
    if (!allowNull && email === null) {
        throw new Error('Email is missing');
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        throw new Error(`Invalid email: ${email}`);
    }

    return email;
}