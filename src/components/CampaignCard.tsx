"use client";

import React from "react";
import { Campaign } from "@/types/Campaign";
import styles from "./CampaignCard.module.css";

export default function CampaignCard({ campaign }: { campaign: Campaign }) {
    const { id, name, created_at, max_players, outline, dungeon_master_name } = campaign;

    const handleClick = () => {
        console.log("Campaign clicked:", id);
        // Add interactivity here.
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className={styles.cardButton}
        >
            <div className={styles.card}>
                <h2>{name}</h2>
                <img className={styles.cardImage} src="https://placehold.co/400" alt="Placeholder" />
                <p><strong>ID:</strong> {id}</p>
                <p><strong>Created At:</strong> {new Date(created_at).toLocaleDateString()}</p>
                <p><strong>Dungeon Master:</strong> {dungeon_master_name}</p>
                <p><strong>Max Players:</strong> {max_players}</p>
                <p><strong>Outline:</strong> {outline}</p>
            </div>
        </button>
    );
}
