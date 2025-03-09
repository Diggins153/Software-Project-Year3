export type Character = {
    id: number;

    name: string;

    handle: string;

    race_id: number;

    race_name?: string;

    image?: string;

    owner_id: number;
}

export type UpdateCharacter = {
    id: number;

    name: string;

    handle: string;

    race_id: number;

    image?: string;
}