import {Controller, Get, Param, Post, Redirect, Render, Req, Request} from '@nestjs/common';
import {Order} from "./order.model";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository, LessThan, MoreThan} from "typeorm";
import {DriverHttpService} from "./driver-http/driver-http.service";
import {ProductHttpService} from "./product-http/product-http.service";
import { readFileSync } from 'fs';

@Controller('orders') // /orders
export class OrderController {
    user: any;
    
    constructor(
        @InjectRepository(Order)
        private readonly orderRepo: Repository<Order>,
        private readonly driverHttp: DriverHttpService,
        private readonly productHttp: ProductHttpService
    ) {
        this.user = JSON.parse(readFileSync("teste.json", "utf8"));
    }

    @Get()
    @Render('order/index')
    async index() {
        this.user = JSON.parse(readFileSync("teste.json", "utf8"));

        let orders = null;

        if(this.user.role == 'ADMIN'){
            this.user.admin = true;
            orders = await this.orderRepo.find({
                order: {
                    created_at: 'DESC',
                }
            });
        }
        else{
            this.user.admin = false;

            orders = await this.orderRepo.find({
                order: {
                    created_at: 'DESC',
                },
                where: {
                    user_id: this.user.id
                }
            });
        }

        return {data: {"user": this.user, "orders": orders}}
    }

    @Get('/create')
    @Render('order/create')
    async create() {
        const drivers = await this.driverHttp.list().toPromise();
        const products = await this.productHttp.list().toPromise();
        return {data: {"products": products, "drivers": drivers, "user": this.user}};
    }

    @Post()
    @Redirect('orders')
    async store(@Req() request: Request) {
        const [location_id, location_name, location_geo] = request.body['location'].split('/');
        const [driver_id, driver_name] = request.body['driver'].split(',');
        const [product_id, product_name, product_price] = request.body['product'].split(',');
        const user_id = this.user.id;
        const user_name = this.user.name;
        const amount = request.body['amount'];
        const total = product_price * amount;
        console.log(total)
        const order = this.orderRepo.create({
            driver_id,
            driver_name,
            location_id,
            location_name,
            product_id,
            product_name,
            total,
            user_id,
            user_name,
            amount,
            location_geo: location_geo.split(',')
        });
        await this.orderRepo.save(order);
    }

    @Get('/report')
    @Render('order/report')
    async report() {
        let today = this.obterData();
        this.user = JSON.parse(readFileSync("teste.json", "utf8"));

        let orders = null;

        this.user.admin = true;
        orders = await this.orderRepo.find({
            order: {
                created_at: 'DESC',
            },
            where: {
                created_at: LessThan(new Date())
            }
        });

        let teste = orders.map( function( elem ){
            let t = new Date(elem.created_at);
            let date = ('0' + t.getDate()).slice(-2);
            let month = ('0' + (t.getMonth() + 1)).slice(-2);
            let year = t.getFullYear();
            elem.created_at = `${date}/${month}/${year}`;
            elem.totalOrder = elem.total;
        } ); 

        let totalOrders = 0;
        totalOrders = orders.reduce( function( prevVal, elem ) {
            return prevVal + elem.total;
        }, 0 );

        // console.log(totalOrders)
        // console.log(today)
        // console.log(new Date())
        // console.log(new Date(today))
        // console.log(orders)
        return {data: {"user": this.user, "orders": orders, "today": today, "totalOrders": totalOrders}}
    }

    @Post('/report/filter')
    @Render('order/report')
    async reportFilter(@Req() request: Request) {
        let today = new Date(request.body['date']);
        today.setDate(today.getDate() + 1);

        this.user = JSON.parse(readFileSync("teste.json", "utf8"));

        let orders = null;

        this.user.admin = true;
        orders = await this.orderRepo.find({
            order: {
                created_at: 'DESC',
            },
            where: {
                created_at: LessThan(today)
            }
        });

        let teste = orders.map( function( elem ){
            let t = new Date(elem.created_at);
            let date = ('0' + t.getDate()).slice(-2);
            let month = ('0' + (t.getMonth() + 1)).slice(-2);
            let year = t.getFullYear();
            elem.created_at = `${date}/${month}/${year}`;
            elem.totalOrder = elem.total;
        } ); 

        let totalOrders = 0;
        totalOrders = orders.reduce( function( prevVal, elem ) {
            return prevVal + elem.total;
        }, 0 );

        return {data: {"user": this.user, "orders": orders, "today": request.body['date'], "totalOrders": totalOrders}};
    }

    obterData() {
        const date = new Date();
    
        const ano = date.getFullYear();
        const mes = date.getMonth() + 1;
        const dia = date.getDate() - 1;

        let mesValor = '';
        let diaValor = '';
    
        mesValor = ((mes < 10) ? '0' : '').concat(mes.toString())
        diaValor = ((dia < 10) ? '0' : '').concat(dia.toString())
    
            return ano.toString().concat('-').concat(mesValor).concat('-').concat(diaValor);
            // return dia.concat('/').concat(mesValor).concat('/').concat(ano.toString());
    }
}
