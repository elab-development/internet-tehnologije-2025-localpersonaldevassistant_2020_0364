import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSnippet1769810315934 implements MigrationInterface {
  name = "CreateSnippet1769810315934";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`snippet\` (\`id\` int NOT NULL AUTO_INCREMENT, \`language\` varchar(100) NOT NULL, \`code\` text NOT NULL, \`title\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`snippet\` ADD CONSTRAINT \`FK_snippet_user\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`snippet\` DROP FOREIGN KEY \`FK_snippet_user\``);
    await queryRunner.query(`DROP TABLE \`snippet\``);
  }
}
