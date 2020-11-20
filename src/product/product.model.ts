import {
    Entity,
    Column,
    PrimaryGeneratedColumn, CreateDateColumn,
} from 'typeorm';

@Entity({name: 'products'})
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    price: number;

    @Column()
    description: string;

    @CreateDateColumn()
    created_at: Date;
}

