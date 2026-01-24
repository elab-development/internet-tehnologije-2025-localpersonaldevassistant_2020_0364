import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";
import { Message } from "./Message";

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
}
