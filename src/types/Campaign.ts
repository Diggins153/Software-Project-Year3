export type Campaign = {
    id: number;

    name: string;

    signups_open: boolean;

    dungeon_master_id: number;

    maxPlayers: number;

    banner?: string;

    outline?: string;
}