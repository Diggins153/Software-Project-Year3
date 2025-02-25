import { Migration } from '@mikro-orm/migrations';

export class Migration20250225190007_Initial extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`class\` (\`id\` int unsigned not null auto_increment primary key, \`created_at\` datetime not null, \`updated_at\` datetime not null, \`name\` varchar(255) not null) default character set utf8mb4 engine = InnoDB;`);

    this.addSql(`create table \`race\` (\`id\` int unsigned not null auto_increment primary key, \`created_at\` datetime not null, \`updated_at\` datetime not null, \`name\` varchar(255) not null) default character set utf8mb4 engine = InnoDB;`);

    this.addSql(`create table \`user\` (\`id\` int unsigned not null auto_increment primary key, \`created_at\` datetime not null, \`updated_at\` datetime not null, \`display_name\` varchar(255) not null, \`email\` varchar(255) not null, \`password\` varchar(255) not null, \`role\` enum('user', 'admin') not null default 'user', \`is_paying\` tinyint(1) not null default false, \`last_consent_date\` datetime not null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`user\` add unique \`user_email_unique\`(\`email\`);`);

    this.addSql(`create table \`character\` (\`id\` int unsigned not null auto_increment primary key, \`created_at\` datetime not null, \`updated_at\` datetime not null, \`name\` varchar(255) not null, \`handle\` varchar(255) not null, \`race_id\` int unsigned not null, \`image\` varchar(255) not null, \`owner_id\` int unsigned not null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`character\` add index \`character_race_id_index\`(\`race_id\`);`);
    this.addSql(`alter table \`character\` add index \`character_owner_id_index\`(\`owner_id\`);`);

    this.addSql(`create table \`character_classes\` (\`character_id\` int unsigned not null, \`class_id\` int unsigned not null, \`level\` int not null default '1', primary key (\`character_id\`, \`class_id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`character_classes\` add index \`character_classes_character_id_index\`(\`character_id\`);`);
    this.addSql(`alter table \`character_classes\` add index \`character_classes_class_id_index\`(\`class_id\`);`);

    this.addSql(`create table \`campaign\` (\`id\` int unsigned not null auto_increment primary key, \`created_at\` datetime not null, \`updated_at\` datetime not null, \`name\` varchar(50) not null, \`signups_open\` tinyint(1) not null default false, \`dungeon_master_id\` int unsigned not null, \`max_players\` int not null default 4, \`banner\` varchar(255) not null, \`outline\` text not null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`campaign\` add index \`campaign_dungeon_master_id_index\`(\`dungeon_master_id\`);`);

    this.addSql(`create table \`campaign_characters\` (\`campaign_id\` int unsigned not null, \`character_id\` int unsigned not null, primary key (\`campaign_id\`, \`character_id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`campaign_characters\` add index \`campaign_characters_campaign_id_index\`(\`campaign_id\`);`);
    this.addSql(`alter table \`campaign_characters\` add index \`campaign_characters_character_id_index\`(\`character_id\`);`);

    this.addSql(`alter table \`character\` add constraint \`character_race_id_foreign\` foreign key (\`race_id\`) references \`race\` (\`id\`) on update cascade;`);
    this.addSql(`alter table \`character\` add constraint \`character_owner_id_foreign\` foreign key (\`owner_id\`) references \`user\` (\`id\`) on update cascade;`);

    this.addSql(`alter table \`character_classes\` add constraint \`character_classes_character_id_foreign\` foreign key (\`character_id\`) references \`character\` (\`id\`) on update cascade;`);
    this.addSql(`alter table \`character_classes\` add constraint \`character_classes_class_id_foreign\` foreign key (\`class_id\`) references \`class\` (\`id\`) on update cascade;`);

    this.addSql(`alter table \`campaign\` add constraint \`campaign_dungeon_master_id_foreign\` foreign key (\`dungeon_master_id\`) references \`user\` (\`id\`) on update cascade;`);

    this.addSql(`alter table \`campaign_characters\` add constraint \`campaign_characters_campaign_id_foreign\` foreign key (\`campaign_id\`) references \`campaign\` (\`id\`) on update cascade on delete cascade;`);
    this.addSql(`alter table \`campaign_characters\` add constraint \`campaign_characters_character_id_foreign\` foreign key (\`character_id\`) references \`character\` (\`id\`) on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`character_classes\` drop foreign key \`character_classes_class_id_foreign\`;`);

    this.addSql(`alter table \`character\` drop foreign key \`character_race_id_foreign\`;`);

    this.addSql(`alter table \`character\` drop foreign key \`character_owner_id_foreign\`;`);

    this.addSql(`alter table \`campaign\` drop foreign key \`campaign_dungeon_master_id_foreign\`;`);

    this.addSql(`alter table \`character_classes\` drop foreign key \`character_classes_character_id_foreign\`;`);

    this.addSql(`alter table \`campaign_characters\` drop foreign key \`campaign_characters_character_id_foreign\`;`);

    this.addSql(`alter table \`campaign_characters\` drop foreign key \`campaign_characters_campaign_id_foreign\`;`);

    this.addSql(`drop table if exists \`class\`;`);

    this.addSql(`drop table if exists \`race\`;`);

    this.addSql(`drop table if exists \`user\`;`);

    this.addSql(`drop table if exists \`character\`;`);

    this.addSql(`drop table if exists \`character_classes\`;`);

    this.addSql(`drop table if exists \`campaign\`;`);

    this.addSql(`drop table if exists \`campaign_characters\`;`);
  }

}
