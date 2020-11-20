import {
    Entity,
    Column,
    PrimaryGeneratedColumn, CreateDateColumn,
} from 'typeorm';

export enum OrderStatus {
    PENDING = 1,
    DONE = 2
}

@Entity({name: 'orders'})
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    driver_id: string;

    @Column()
    driver_name: string;

    @Column()
    location_id: number;

    @Column()
    location_name: string;

    @Column()
    user_id: string;

    @Column()
    user_name: string;

    @Column()
    product_id: string;

    @Column()
    product_name: string;

    @Column()
    amount: number;

    @Column("simple-array")
    location_geo: number[];

    @Column()
    status: OrderStatus = OrderStatus.PENDING;

    @CreateDateColumn()
    created_at: Date;
}

