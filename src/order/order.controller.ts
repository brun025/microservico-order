import {Controller, Get, Post, Redirect, Render, Req, Request} from '@nestjs/common';
import {Order} from "./order.model";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {DriverHttpService} from "./driver-http/driver-http.service";
import {ProductHttpService} from "./product-http/product-http.service";

@Controller('orders') // /orders
export class OrderController {

    constructor(
        @InjectRepository(Order)
        private readonly orderRepo: Repository<Order>,
        private readonly driverHttp: DriverHttpService,
        private readonly productHttp: ProductHttpService
    ) {

    }

    @Get()
    @Render('order/index')
    async index() {
        const orders = await this.orderRepo.find({
            order: {
                created_at: 'DESC'
            }
        });
        return {data: orders}
    }

    @Get('/create')
    @Render('order/create')
    async create() {
        const drivers = await this.driverHttp.list().toPromise();
        const products = await this.productHttp.list().toPromise();
        return {data: {"products": products, "drivers": drivers}};
    }

    @Post()
    @Redirect('orders')
    async store(@Req() request: Request) {
        const [location_id, location_name, location_geo] = request.body['location'].split('/');
        const [driver_id, driver_name] = request.body['driver'].split(',');
        const [product_id, product_name] = request.body['product'].split(',');
        // const product_id = request.body['product'];
        const amount = request.body['amount'];
        const order = this.orderRepo.create({
            driver_id,
            driver_name,
            location_id,
            location_name,
            product_id,
            product_name,
            amount,
            location_geo: location_geo.split(',')
        });
        await this.orderRepo.save(order);
    }
}
