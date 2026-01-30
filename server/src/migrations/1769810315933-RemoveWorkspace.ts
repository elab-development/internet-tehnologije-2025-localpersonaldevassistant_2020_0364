import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveWorkspace1769810315933 implements MigrationInterface {
  name = "RemoveWorkspace1769810315933";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`session\` DROP FOREIGN KEY \`FK_dca03a1a5ca84cccac1f95447ae\``);
    await queryRunner.query(`ALTER TABLE \`session\` DROP COLUMN \`workspaceId\``);
    await queryRunner.query(`DROP TABLE \`workspace\``);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`workspace\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(`ALTER TABLE \`session\` ADD \`workspaceId\` int NULL`);
    await queryRunner.query(
      `ALTER TABLE \`workspace\` ADD CONSTRAINT \`FK_b48532fc84800d41cfee110682c\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`session\` ADD CONSTRAINT \`FK_dca03a1a5ca84cccac1f95447ae\` FOREIGN KEY (\`workspaceId\`) REFERENCES \`workspace\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }
}
