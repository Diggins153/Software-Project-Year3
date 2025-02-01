"use server";

export async function hasSpecialCharacter(text: string): Promise<boolean> {
    const pattern = /\\D\\W"/;
    return pattern.test(text);
}

export async function hasDigits(text: string): Promise<boolean> {
    const pattern = /\\d/;
    return pattern.test(text);
}

export async function hasUppercase(text: string): Promise<boolean> {
    const pattern = /[A-Z]/;
    return pattern.test(text);
}

export async function hasLowercase(text: string): Promise<boolean> {
    const pattern = /[a-z]/;
    return pattern.test(text);
}
