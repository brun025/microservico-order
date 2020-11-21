import {Controller, Get, Param, Post, Redirect, Render, Req, Request} from '@nestjs/common';
import {User} from "./user.model";
import {InjectRepository} from "@nestjs/typeorm";
import {UserService} from "./user.service";
import {Repository} from "typeorm";
import { UserRole } from './user-roles.enum';

@Controller('users') // /users
export class UserController {

    baseUrl = process.env.MICRO_DRIVERS_URL;

    constructor(
        @InjectRepository(User)
        private readonly productRepo: Repository<User>,
        private readonly userHttp: UserService
    ) {

    }

    @Get()
    @Render('user/index')
    async index() {
        const users = await this.userHttp.list().toPromise();
        return {data: users}
    }

    @Get('/create')
    @Render('user/create')
    async create() {
        const roles = UserRole;
        return {roles};
    }

    @Get('/edit/:id')
    @Render('user/edit')
    async edit(@Param('id') id: string) {
        const user = await this.userHttp.show(id).toPromise();
        // console.log(user);
        const roles = UserRole;
        return {data: {"user": user, "roles": roles}};
    }

    @Post()
    @Redirect('/users')
    async store(@Req() request: Request) {
        const user = new User();
        user.name = request.body['name'];
        user.email = request.body['email'];
        user.password = request.body['password'];
        user.passwordConfirmation = request.body['passwordConfirmation'];
        user.role = request.body['role'];
        const result = await this.userHttp.post(user).toPromise();
        // console.log(result);
    }

    @Post('/update/:id')
    @Redirect('/users')
    async patch(@Req() request: Request, @Param('id') id: string) {
        const user = new User();
        user.name = request.body['name'];
        user.email = request.body['email'];
        user.role = request.body['role'];
        const result = await this.userHttp.patch(user, id).toPromise();
        // console.log(result);
    }

    @Get('/destroy/:id')
    @Redirect('/users')
    async destroy(@Param('id') id: string) {
        const result = await this.userHttp.destroy(id).toPromise();
        // console.log(result);
    }
}
