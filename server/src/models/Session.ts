import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";
import { Message } from "./Message";
import { Workspace } from "./Workspace";

@Entity()
export class Session {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column()
  title!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  lastActivityAt!: Date;

  @ManyToOne(() => User, (user) => user.sessions)
  user!: User;

  @OneToMany(() => Message, (message) => message.session)
  messages!: Message[];

  @ManyToOne(() => Workspace, (workspace) => workspace.sessions, { nullable: true, onDelete: "SET NULL" })
  workspace!: Workspace | null;
}
