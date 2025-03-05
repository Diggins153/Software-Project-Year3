export type Character = {
    id: number;

    name: string;

    handle: string;

    race_id: number;

    race_name: string | undefined;

    image?: string;

    owner_id: number;
}
