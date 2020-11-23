import {Controller, Get, Param, Post, Redirect, Render, Req, Request} from '@nestjs/common';
import {Product} from "./product.model";
import {InjectRepository} from "@nestjs/typeorm";
import {ProductService} from "./product.service";
import {Repository} from "typeorm";
import { readFileSync } from 'fs';

@Controller('products') // /products
export class ProductController {

    baseUrl = process.env.MICRO_DRIVERS_URL;
    user: any;

    constructor(
        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,
        private readonly productHttp: ProductService
    ) {
        this.user = JSON.parse(readFileSync("teste.json", "utf8"));
    }

    @Get()
    @Render('product/index')
    async index() {
        this.user = JSON.parse(readFileSync("teste.json", "utf8"));

        if(this.user.role == 'ADMIN')
            this.user.admin = true;
        else
            this.user.admin = false;

        const products = await this.productHttp.list().toPromise();
        return {data: {"products": products, "user": this.user}}
    }

    @Get('/create')
    @Render('product/create')
    async create() {
        return {data: {"user": this.user}}
    }

    @Get('/edit/:id')
    @Render('product/edit')
    async edit(@Param('id') id: string) {
        const product = await this.productHttp.show(id).toPromise();
        return {data: {"product": product, "user": this.user}}
    }

    @Post()
    @Redirect('/products')
    async store(@Req() request: Request) {
        const product = new Product();
        product.name = request.body['name'],
        product.price = request.body['price'],
        product.description = request.body['description']
        const result = await this.productHttp.post(product).toPromise();
        // console.log(result);
    }

    @Post('/update/:id')
    @Redirect('/products')
    async patch(@Req() request: Request, @Param('id') id: string) {
        const product = new Product();
        product.name = request.body['name'],
        product.price = request.body['price'],
        product.description = request.body['description']
        const result = await this.productHttp.patch(product, id).toPromise();
        // console.log(result);
    }

    @Get('/destroy/:id')
    @Redirect('/products')
    async destroy(@Param('id') id: string) {
        const result = await this.productHttp.destroy(id).toPromise();
        // console.log(result);
    }
}
