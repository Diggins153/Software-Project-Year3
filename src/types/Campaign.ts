export type Campaign = {
    id: number;

    created_at: Date

    name: string;

    signups_open: boolean;

    dungeon_master_id: number;

    maxPlayers: number;

    banner?: string;

    outline?: string;
}