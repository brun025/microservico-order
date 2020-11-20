import {HttpModule, Module} from '@nestjs/common';
import {ProductController} from "./product.controller";
import {Product} from "./product.model";
import {TypeOrmModule} from "@nestjs/typeorm";
import { ProductService } from './product.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Product]),
        HttpModule
    ],
    controllers: [ProductController],
    providers: [ProductService]
})
export class ProductModule {
}
