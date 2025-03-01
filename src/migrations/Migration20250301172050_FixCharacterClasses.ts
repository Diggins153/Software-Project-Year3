import { Migration } from '@mikro-orm/migrations';

export class Migration20250301172050_FixCharacterClasses extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`character_class\` (\`character_id\` int unsigned not null, \`class_id\` int unsigned not null, \`level\` int not null default '1', primary key (\`character_id\`, \`class_id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`character_class\` add index \`character_class_character_id_index\`(\`character_id\`);`);
    this.addSql(`alter table \`character_class\` add index \`character_class_class_id_index\`(\`class_id\`);`);

    this.addSql(`alter table \`character_class\` add constraint \`character_class_character_id_foreign\` foreign key (\`character_id\`) references \`character\` (\`id\`) on update cascade;`);
    this.addSql(`alter table \`character_class\` add constraint \`character_class_class_id_foreign\` foreign key (\`class_id\`) references \`class\` (\`id\`) on update cascade;`);

    this.addSql(`drop table if exists \`character_classes\`;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table \`character_classes\` (\`character_id\` int unsigned not null, \`class_id\` int unsigned not null, \`level\` int not null default '1', primary key (\`character_id\`, \`class_id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`character_classes\` add index \`character_classes_character_id_index\`(\`character_id\`);`);
    this.addSql(`alter table \`character_classes\` add index \`character_classes_class_id_index\`(\`class_id\`);`);

    this.addSql(`alter table \`character_classes\` add constraint \`character_classes_character_id_foreign\` foreign key (\`character_id\`) references \`character\` (\`id\`) on update cascade;`);
    this.addSql(`alter table \`character_classes\` add constraint \`character_classes_class_id_foreign\` foreign key (\`class_id\`) references \`class\` (\`id\`) on update cascade;`);

    this.addSql(`drop table if exists \`character_class\`;`);
  }

}
