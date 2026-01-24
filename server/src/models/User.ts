import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Session } from "./Session";
import { Workspace } from "./Workspace";

@Entity()
export class User {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ nullable: true })
  lastLoginAt!: Date;

  @OneToMany(() => Session, (session) => session.user)
  sessions!: Session[];

  @OneToMany(() => Workspace, (workspace) => workspace.user)
  workspaces!: Workspace[];
}
