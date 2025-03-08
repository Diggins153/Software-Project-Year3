export type User = {
    id: number

    display_name: string;

    email: string;

    password: string;

    role: Role;

    gdpr_consent: Date;
}

export type Role = "user" | "admin";
