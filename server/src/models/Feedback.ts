import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn } from "typeorm";
import { Message } from "./Message";

@Entity()
export class Feedback {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column()
  isPositive!: boolean; // true = Like, false = Dislike

  @Column({ type: "text", nullable: true })
  comment!: string; // Only filled if isPositive is false

  @CreateDateColumn()
  createdAt!: Date;

  @OneToOne(() => Message, (message) => message.feedback, { onDelete: "CASCADE" })
  @JoinColumn()
  message!: Message;
}
