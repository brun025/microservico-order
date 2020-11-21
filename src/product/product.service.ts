import {HttpService, Injectable} from '@nestjs/common';
import {map} from "rxjs/operators";

@Injectable()
export class ProductService {

    baseUrl = process.env.MICRO_DRIVERS_URL;

    constructor(private readonly httpService: HttpService) {
    }

    list() {
        return this.httpService
            .get(`${this.baseUrl}/products`)
            .pipe(
                map(response => response.data.found.products)
            ) //Reactive X
    }

    post(product) {
        try {
            return this.httpService
                .post(`${this.baseUrl}/products`, product)
                .pipe(
                    map(response => response.data)
                )
        } catch (error) {
            console.log(error)
        }
    }

    destroy(id){
        return this.httpService
            .delete(`${this.baseUrl}/products/${id}`)
            .pipe(
                map(response => response.data)
            )
    }

    show(id){
        return this.httpService
            .get(`${this.baseUrl}/products/${id}`)
            .pipe(
                map(response => response.data.product)
            )
    }

    patch(product, id) {
        try {
            return this.httpService
                .patch(`${this.baseUrl}/products/${id}`, product)
                .pipe(
                    map(response => response.data)
                )
        } catch (error) {
            console.log(error)
        }
    }
}
