import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";
import { Session } from "./Session";

@Entity()
export class Workspace {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true, type: "text" })
  description!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.workspaces, { onDelete: "CASCADE" })
  user!: User;

  @OneToMany(() => Session, (session) => session.workspace)
  sessions!: Session[];
}
