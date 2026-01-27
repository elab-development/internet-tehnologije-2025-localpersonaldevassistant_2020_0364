import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserRoles1769537808705 implements MigrationInterface {
    name = 'AddUserRoles1769537808705'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`role\` enum ('ADMIN', 'REGULAR', 'GUEST') NOT NULL DEFAULT 'REGULAR'`);
        await queryRunner.query(`ALTER TABLE \`feedback\` DROP FOREIGN KEY \`FK_326c785b6f3c1c5c7eb8c2ed136\``);
        await queryRunner.query(`ALTER TABLE \`feedback\` CHANGE \`comment\` \`comment\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`feedback\` CHANGE \`messageId\` \`messageId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_58be890b9a1199e6da5037a994f\``);
        await queryRunner.query(`ALTER TABLE \`message\` CHANGE \`sessionId\` \`sessionId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`workspace\` DROP FOREIGN KEY \`FK_b48532fc84800d41cfee110682c\``);
        await queryRunner.query(`ALTER TABLE \`workspace\` CHANGE \`description\` \`description\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`workspace\` CHANGE \`userId\` \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`session\` DROP FOREIGN KEY \`FK_3d2f174ef04fb312fdebd0ddc53\``);
        await queryRunner.query(`ALTER TABLE \`session\` DROP FOREIGN KEY \`FK_dca03a1a5ca84cccac1f95447ae\``);
        await queryRunner.query(`ALTER TABLE \`session\` CHANGE \`userId\` \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`session\` CHANGE \`workspaceId\` \`workspaceId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`lastLoginAt\` \`lastLoginAt\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`feedback\` ADD CONSTRAINT \`FK_326c785b6f3c1c5c7eb8c2ed136\` FOREIGN KEY (\`messageId\`) REFERENCES \`message\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
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
        await queryRunner.query(`ALTER TABLE \`feedback\` DROP FOREIGN KEY \`FK_326c785b6f3c1c5c7eb8c2ed136\``);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`lastLoginAt\` \`lastLoginAt\` datetime NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`session\` CHANGE \`workspaceId\` \`workspaceId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`session\` CHANGE \`userId\` \`userId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`session\` ADD CONSTRAINT \`FK_dca03a1a5ca84cccac1f95447ae\` FOREIGN KEY (\`workspaceId\`) REFERENCES \`workspace\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`session\` ADD CONSTRAINT \`FK_3d2f174ef04fb312fdebd0ddc53\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`workspace\` CHANGE \`userId\` \`userId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`workspace\` CHANGE \`description\` \`description\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`workspace\` ADD CONSTRAINT \`FK_b48532fc84800d41cfee110682c\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`message\` CHANGE \`sessionId\` \`sessionId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_58be890b9a1199e6da5037a994f\` FOREIGN KEY (\`sessionId\`) REFERENCES \`session\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`feedback\` CHANGE \`messageId\` \`messageId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`feedback\` CHANGE \`comment\` \`comment\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`feedback\` ADD CONSTRAINT \`FK_326c785b6f3c1c5c7eb8c2ed136\` FOREIGN KEY (\`messageId\`) REFERENCES \`message\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`role\``);
    }

}
