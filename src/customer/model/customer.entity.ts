import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  psid: string;

  @Column({
    default: new Date().toISOString(),
  })
  created: string;
}
