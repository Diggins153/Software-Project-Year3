// CampaignCard.tsx (Server Component)
import React from 'react';
import styles from "./CampaignCard.module.css";

interface CardProps {
    id: number;
    name: string;
    created_at: string;
    dungeon_master: string;
    max_players: number;
    outline: string;
}

const CampaignCard: React.FC<CardProps> = ({ id, name, created_at, dungeon_master, max_players, outline }) => {
    return (
        <div className={styles.card}>
            <h2>{name}</h2>
            <img className={styles.cardImage} src = "https://placehold.co/400" alt="Placeholder"/>
            <p><strong>ID:</strong> {id}</p>
            <p><strong>Created At:</strong> {new Date(created_at).toLocaleDateString()}</p>
            <p><strong>Dungeon Master:</strong> {dungeon_master}</p>
            <p><strong>Max Players:</strong> {max_players}</p>
            <p><strong>Outline:</strong> {outline}</p>
        </div>
    );
};

export default CampaignCard;
