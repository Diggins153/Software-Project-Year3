export function hasSpecialCharacter(text: string): boolean {
    const pattern = /\\D\\W"/;
    return pattern.test(text);
}

export function hasDigits(text: string): boolean {
    const pattern = /\\d/;
    return pattern.test(text);
}

export function hasUppercase(text: string): boolean {
    const pattern = /[A-Z]/;
    return pattern.test(text);
}

export function hasLowercase(text: string): boolean {
    const pattern = /[a-z]/;
    return pattern.test(text);
}
