import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sku: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  price: number;

  @Column()
  upc: string;

  @Column()
  shipping: number;

  @Column()
  description: string;

  @Column()
  manufacturer: string;

  @Column()
  model: string;

  @Column()
  url: string;

  @Column()
  image: string;
}
