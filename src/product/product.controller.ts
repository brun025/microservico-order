import {Controller, Delete, Get, Param, Post, Redirect, Render, Req, Request} from '@nestjs/common';
import {Product} from "./product.model";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {HttpService, Injectable} from '@nestjs/common';
import {map} from "rxjs/operators";
import {ProductService} from "./product.service";

@Controller('products') // /products
export class ProductController {

    baseUrl = process.env.MICRO_DRIVERS_URL;

    constructor(
        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,
        private readonly productHttp: ProductService
    ) {

    }

    @Get()
    @Render('product/index')
    async index() {
        const products = await this.productHttp.list().toPromise();
        return {data: products}
    }

    @Get('/create')
    @Render('product/create')
    async create() {
        return;
    }

    @Post()
    @Redirect('products')
    async store(@Req() request: Request) {
        const product = {
            "name": request.body['name'],
            "price": request.body['price'],
            "description": request.body['description']
        }
        const products = await this.productHttp.post(product).toPromise();
        // console.log(products);
    }

    @Get('/destroy/:id')
    @Redirect('/products')
    async destroy(@Param('id') id: string) {
        const products = await this.productHttp.destroy(id).toPromise();
        // console.log(products);
    }
}
