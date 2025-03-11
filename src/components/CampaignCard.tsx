"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Campaign } from "@/types/Campaign";
import styles from "./CampaignCard.module.css";

export default function CampaignCard({ campaign }: { campaign: Campaign }) {
    const router = useRouter();
    const {
        //@ts-ignore
        campaign_id,
        //@ts-ignore
        campaign_name,
        created_at,
        max_players,
        outline,
        dungeon_master_name,
    } = campaign;

    const handleClick = () => {
        console.log("Campaign clicked, id:", campaign_id);
        // Navigate to the campaign view page with the campaign id as a query parameter.
        router.push(`/campaigns/view?campaignId=${campaign_id}`);
    };

    return (
        <button type="button" onClick={handleClick} className={styles.cardButton}>
            <div className={styles.card}>
                <div className={styles.textSection}>
                    <div className={styles.header}>
                        <h2>{campaign_name}</h2>
                    </div>
                    <div className={styles.body}>
                        <p><strong>ID:</strong> {campaign_id}</p>
                        <p>
                            <strong>Created At:</strong> {new Date(created_at).toLocaleDateString("en-US")}
                        </p>
                        <p><strong>Dungeon Master:</strong> {dungeon_master_name}</p>
                        <p><strong>Max Players:</strong> {max_players}</p>
                        <p><strong>Outline:</strong> {outline}</p>
                    </div>
                </div>
                <div className={styles.imageSection}>
                    <img className={styles.cardImage} src="https://placehold.co/400" alt="Placeholder" />
                </div>
            </div>
        </button>
    );
}
