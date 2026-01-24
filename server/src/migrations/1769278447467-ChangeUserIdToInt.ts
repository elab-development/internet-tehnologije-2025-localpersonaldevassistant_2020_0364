import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeUserIdToInt1769278447467 implements MigrationInterface {
    name = 'ChangeUserIdToInt1769278447467'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_58be890b9a1199e6da5037a994f\``);
        await queryRunner.query(`ALTER TABLE \`message\` CHANGE \`sessionId\` \`sessionId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`session\` DROP FOREIGN KEY \`FK_3d2f174ef04fb312fdebd0ddc53\``);
        await queryRunner.query(`ALTER TABLE \`session\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`session\` ADD \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`id\` int NOT NULL PRIMARY KEY AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`lastLoginAt\` \`lastLoginAt\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_58be890b9a1199e6da5037a994f\` FOREIGN KEY (\`sessionId\`) REFERENCES \`session\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`session\` ADD CONSTRAINT \`FK_3d2f174ef04fb312fdebd0ddc53\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`session\` DROP FOREIGN KEY \`FK_3d2f174ef04fb312fdebd0ddc53\``);
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_58be890b9a1199e6da5037a994f\``);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`lastLoginAt\` \`lastLoginAt\` datetime NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`id\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`session\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`session\` ADD \`userId\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`session\` ADD CONSTRAINT \`FK_3d2f174ef04fb312fdebd0ddc53\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`message\` CHANGE \`sessionId\` \`sessionId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_58be890b9a1199e6da5037a994f\` FOREIGN KEY (\`sessionId\`) REFERENCES \`session\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
