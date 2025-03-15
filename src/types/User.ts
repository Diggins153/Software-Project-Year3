export type User = {
    id: number

    display_name: string;

    email: string;

    password: string;

    role: Role;

    gdpr_consent: Date;

    banned: boolean;
}

export type Role = "user" | "admin";
