import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn } from "typeorm";
import { Message } from "./Message";

@Entity()
export class Feedback {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column()
  isPositive!: boolean;

  @Column({ type: "text", nullable: true })
  comment!: string;

  @OneToOne(() => Message, (message) => message.feedback, { onDelete: "CASCADE" })
  @JoinColumn()
  message!: Message;
}
