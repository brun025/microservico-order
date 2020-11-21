import {HttpService, Injectable} from '@nestjs/common';
import {map} from "rxjs/operators";

@Injectable()
export class UserService {

    baseUrl = process.env.MICRO_DRIVERS_URL;

    constructor(private readonly httpService: HttpService) {
    }

    list() {
        return this.httpService
            .get(`${this.baseUrl}/users`)
            .pipe(
                map(response => response.data.found.users)
            ) //Reactive X
    }

    post(user) {
        try {
            return this.httpService
                .post(`${this.baseUrl}/users`, user)
                .pipe(
                    map(response => response.data)
                )
        } catch (error) {
            console.log(error)
        }
    }

    destroy(id){
        return this.httpService
            .delete(`${this.baseUrl}/users/${id}`)
            .pipe(
                map(response => response.data)
            )
    }

    show(id){
        return this.httpService
            .get(`${this.baseUrl}/users/${id}`)
            .pipe(
                map(response => response.data.user)
            )
    }

    patch(user, id) {
        try {
            return this.httpService
                .patch(`${this.baseUrl}/users/${id}`, user)
                .pipe(
                    map(response => response.data)
                )
        } catch (error) {
            console.log(error)
        }
    }
}
