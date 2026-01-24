import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateWorkspace1769280885355 implements MigrationInterface {
    name = 'CreateWorkspace1769280885355'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`workspace\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`session\` ADD \`workspaceId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_58be890b9a1199e6da5037a994f\``);
        await queryRunner.query(`ALTER TABLE \`message\` CHANGE \`sessionId\` \`sessionId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`session\` DROP FOREIGN KEY \`FK_3d2f174ef04fb312fdebd0ddc53\``);
        await queryRunner.query(`ALTER TABLE \`session\` CHANGE \`userId\` \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`lastLoginAt\` \`lastLoginAt\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_58be890b9a1199e6da5037a994f\` FOREIGN KEY (\`sessionId\`) REFERENCES \`session\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`workspace\` ADD CONSTRAINT \`FK_b48532fc84800d41cfee110682c\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`session\` ADD CONSTRAINT \`FK_3d2f174ef04fb312fdebd0ddc53\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`session\` ADD CONSTRAINT \`FK_dca03a1a5ca84cccac1f95447ae\` FOREIGN KEY (\`workspaceId\`) REFERENCES \`workspace\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`session\` DROP FOREIGN KEY \`FK_dca03a1a5ca84cccac1f95447ae\``);
        await queryRunner.query(`ALTER TABLE \`session\` DROP FOREIGN KEY \`FK_3d2f174ef04fb312fdebd0ddc53\``);
        await queryRunner.query(`ALTER TABLE \`workspace\` DROP FOREIGN KEY \`FK_b48532fc84800d41cfee110682c\``);
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_58be890b9a1199e6da5037a994f\``);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`lastLoginAt\` \`lastLoginAt\` datetime NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`session\` CHANGE \`userId\` \`userId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`session\` ADD CONSTRAINT \`FK_3d2f174ef04fb312fdebd0ddc53\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`message\` CHANGE \`sessionId\` \`sessionId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_58be890b9a1199e6da5037a994f\` FOREIGN KEY (\`sessionId\`) REFERENCES \`session\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`session\` DROP COLUMN \`workspaceId\``);
        await queryRunner.query(`DROP TABLE \`workspace\``);
    }

}
