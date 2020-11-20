import {HttpService, Injectable} from '@nestjs/common';
import {map} from "rxjs/operators";

@Injectable()
export class ProductHttpService {

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

    show(id){
        return this.httpService
            .get(`${this.baseUrl}/driver/${id}`)
            .pipe(
                map(response => response.data)
            )
    }
}
