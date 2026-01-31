import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Snippet {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column({ length: 100 })
  language!: string;

  @Column("text")
  code!: string;

  @Column({ length: 255 })
  title!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.snippets, { onDelete: "CASCADE" })
  user!: User;
}
