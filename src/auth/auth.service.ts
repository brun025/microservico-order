import {HttpService, Injectable} from '@nestjs/common';
import {map} from "rxjs/operators";

@Injectable()
export class AuthService {

    baseUrl = process.env.MICRO_DRIVERS_URL;

    constructor(private readonly httpService: HttpService) {
    }

    post(user) {
        try {
            return this.httpService
                .post(`${this.baseUrl}/auth/signin`, user)
                .pipe(
                    map(response => response.data)
                )
        } catch (error) {
            console.log(error)
        }
    }

}
