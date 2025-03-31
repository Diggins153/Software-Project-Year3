INSERT INTO user (id, display_name, email, password, role, gdpr_consent) VALUES
                                                                             (1, 'Falcon', 'falcon@email.com', '$2a$12$SAQVLDgqc2wnjkOjH6KlLO5qgUqNnI3Iaz23xpkbX7fZi9E5r/obS', 'user', '2025-02-25 18:22:55'),
                                                                             (2, 'Alice the Adventurer', 'alice_dm@example.com', '$2a$12$KvVMzr.aR89MfF9zKxkxteE7l2QqlScsYn7jrcbehgNdNOB0KvWzC', 'user', '2025-01-15 00:00:00'),
                                                                             (3, 'Bob the Bold', 'bob_dm@example.com', '$2a$12$cT27yJnNxFgmAthdoGL5M.lbbeuk0GA1Hu2gnAl2/SVUpsmwB/U3W', 'user', '2024-12-10 00:00:00'),
                                                                             (4, 'Charlie the Crafty', 'charlie_dm@example.com', '$2a$12$owL1MfN.ifgE3FfSsotaae2HGoon1IQF7l5WiWZRdKRbjWM.xgKSO', 'user', '2024-11-22 00:00:00'),
                                                                             (5, 'Diana the Determined', 'diana_dm@example.com', '$2a$12$zD0/qH7XOPjzBLQMsqZimupQC7GPbyQSzkr9Kj8uDY.vvQbFU3I4C', 'user', '2025-01-05 00:00:00'),
                                                                             (6, 'Brick', 'Brick@gmail.com', '$2a$12$57LZiiL09iLk.b/0rYOzquJqkne5jIR0ZL5DZygppn7NsRVSIU3nG', 'user', '2025-02-26 15:24:10'),
                                                                             (7, 'Meepo', 'Meepo@gmail.com', '$2a$12$.edi/VdkYCWXMEx/OhwQ8uiRXhQvVe0MEahtnCNlf98h3p4Cr6JPu', 'user', '2025-02-27 22:56:06');

INSERT INTO race (id, name) VALUES
                                (2, 'Goliath'),
                                (3, 'Elf'),
                                (4, 'Human'),
                                (5, 'Half-Orc'),
                                (6, 'Dwarf'),
                                (7, 'Tiefling'),
                                (8, 'Halfling'),
                                (9, 'Dragonborn'),
                                (10, 'Gnome'),
                                (11, 'Half-Elf'),
                                (12, 'Orc'),
                                (13, 'Goblin');

INSERT INTO class (id, name) VALUES
                                 (1, 'Barbarian'),
                                 (2, 'Rogue'),
                                 (3, 'Wizard'),
                                 (4, 'Paladin'),
                                 (5, 'Fighter'),
                                 (6, 'Warlock'),
                                 (7, 'Sorcerer'),
                                 (8, 'Ranger'),
                                 (9, 'Monk'),
                                 (10, 'Artificer'),
                                 (11, 'Bard'),
                                 (12, 'Druid');

INSERT INTO `character` (id, name, handle, class_id, level, race_id, image, owner_id) VALUES
                                                                         (13, 'Grog the Mighty', 'handle:Grog the Mighty', 1, 1, 2, 'https://placehold.co/75.png', 7),
                                                                         (14, 'Elara the Swift', 'handle:Elara the Swift', 2, 1, 3, 'https://placehold.co/75.png', 7),
                                                                         (15, 'Nyx the Shadow', 'handle:Nyx the Shadow', 6, 1, 7, 'https://placehold.co/75.png', 7),
                                                                         (16, 'k', 'handle:k', 5, 1, 3, 'https://placehold.co/75.png', 7),
                                                                         (17, 'a', 'handle:a', 9, 1, 6, 'https://placehold.co/75.png', 6),
                                                                         (18, 'Rat', 'handle:Rat', 12, 20, 3, 'https://placehold.co/75.png', 6),
                                                                         (19, 'Grog the Mighty', 1, 1, '@Grog the Mighty', 2, 'https://placehold.co/75.png', 6),
                                                                         (20, 'Grog the Mighty', 1, 1, '@Grog the Mighty', 2, '', 7);

INSERT INTO campaign (id, name, signups_open, dungeon_master_id, max_players, outline) VALUES
                                                                                                   (3, 'The Lost Caverns', 1, 2, 5, 'Explore the deep mysteries of the lost caverns.'),
                                                                                                   (4, 'Forest of Whispers', 1, 3, 4, 'Uncover secrets in a magical forest.'),
                                                                                                   (5, 'Dreadhold Escape', 1, 4, 6, 'Break out from the high-security fortress Dreadhold.'),
                                                                                                   (6, 'Desert of Shadows', 1, 5, 8, 'Survive the treacherous sands of the Desert of Shadows.');

INSERT INTO campaign_characters (campaign_id, character_id, status) VALUES
                                                                       (3, 13, 'joined'),
                                                                       (3, 14, 'joined'),
                                                                       (3, 15, 'joined'),
                                                                       (3, 16, 'joined'),
                                                                       (3, 18, 'joined');

INSERT INTO premade_character (name, race_id, class_id, description, image) VALUES
                                                                                ('Grog the Mighty', 2, 1, 'Loves smashing things. Not so great at math. Has won many battles and lost many arguments.', NULL),
                                                                                ('Elara the Swift', 3, 2, 'Steals hearts... and your gold pouch. Will definitely flirt with the enemy mid-fight.', NULL),
                                                                                ('Zymar the Arcane', 4, 3, 'Magic runs through their veins... sometimes too much. Once accidentally polymorphed into a duck.', NULL),
                                                                                ('Seraphina Lightbringer', 5, 4, 'Holy warrior, radiant smile, terrifying smites. Will heal you, then guilt-trip you for needing healing.', NULL),
                                                                                ('Brom Ironfist', 6, 5, 'Stubborn, tough, and swings an axe like it\'s an extension of his beard. Loves ale and battle equally.', NULL),
                                                                                ('Nyx the Shadow', 7, 6, 'Pacts with dark forces? Check. Shadowy past? Check. Really good at dramatic pauses? Absolutely.', NULL),
                                                                                ('Finn Songfoot', 8, 11, 'Plays the lute, charms the crowd, and probably knows more gossip than a noble’s servant.', NULL),
                                                                                ('Ignis Stormborn', 9, 7, 'Born with power, breathes magic, and occasionally sets things on fire... on purpose.', NULL),
                                                                                ('Willow Thistlebloom', 10, 12, 'Can turn into a bear, but prefers to chat with squirrels. Deeply concerned about deforestation.', NULL),
                                                                                ('Kaelen Shadowstep', 11, 8, 'Silent, deadly, and has a wolf companion that’s more social than he is.', NULL),
                                                                                ('Torug the Serene', 12, 9, 'Once punched a tree so hard it apologized. Finds inner peace through disciplined fury.', NULL),
                                                                                ('Zibzok the Tinkerer', 13, 10, 'Builds crazy gadgets, some of which explode. Claims that’s "just a feature."', NULL);
