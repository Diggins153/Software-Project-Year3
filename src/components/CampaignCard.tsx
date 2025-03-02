import { Campaign } from "@/entities/Campaign";
import styles from "./CampaignCard.module.css";

export default async function CampaignCard({ campaign }: { campaign: Campaign }) {
    const { id, name, createdAt, dungeonMaster, maxPlayers, outline } = campaign;

    return (
        <div className={ styles.card }>
            <h2>{ name }</h2>
            <img className={ styles.cardImage } src="https://placehold.co/400" alt="Placeholder"/>
            <p><strong>ID:</strong> { id }</p>
            <p><strong>Created At:</strong> { new Date(createdAt).toLocaleDateString() }</p>
            <p><strong>Dungeon Master:</strong> { dungeonMaster.displayName }</p>
            <p><strong>Max Players:</strong> { maxPlayers }</p>
            <p><strong>Outline:</strong> { outline }</p>
        </div>
    );
};
