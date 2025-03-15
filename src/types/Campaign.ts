export type Campaign = {
    id: number;

    created_at: Date

    name: string;

    signups_open: boolean;

    dungeon_master_id: number;

    dungeon_master_name?: string;

    max_players: number;

    banner?: string;

    outline?: string;

    public: boolean;

    invite?: string;
}