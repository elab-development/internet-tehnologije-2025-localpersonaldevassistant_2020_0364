import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToOne } from "typeorm";
import { Session } from "./Session";
import { SenderType, Mode } from "./Enums";
import { Feedback } from "./Feedback";

@Entity()
export class Message {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column("text")
  content!: string;

  @Column({
    type: "enum",
    enum: SenderType,
    default: SenderType.USER,
  })
  senderType!: SenderType;

  @Column({
    type: "enum",
    enum: Mode,
    default: Mode.GENERATION,
  })
  mode!: Mode;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => Session, (session) => session.messages)
  session!: Session;

  @OneToOne(() => Feedback, (feedback) => feedback.message)
  feedback!: Feedback;
}
