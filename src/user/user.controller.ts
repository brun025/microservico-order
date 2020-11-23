import {Controller, Get, Param, Post, Redirect, Render, Req, Request} from '@nestjs/common';
import {User} from "./user.model";
import {InjectRepository} from "@nestjs/typeorm";
import {UserService} from "./user.service";
import {Repository} from "typeorm";
import { UserRole } from './user-roles.enum';
import { readFileSync } from 'fs';

@Controller('users') // /users
export class UserController {

    baseUrl = process.env.MICRO_DRIVERS_URL;
    user: any;

    constructor(
        @InjectRepository(User)
        private readonly productRepo: Repository<User>,
        private readonly userHttp: UserService
    ) {
    }

    @Get()
    @Render('user/index')
    async index() {
        this.user = JSON.parse(readFileSync("teste.json", "utf8"));

        let users = null;

        if(this.user.role != 'ADMIN'){
            this.user.admin = false;
            users = [this.user];
        }
        else{
            this.user.admin = true;
            users = await this.userHttp.list().toPromise();
        }

        return {data: {"user": this.user, "users": users}}
    }

    @Get('/create')
    @Render('user/create')
    async create() {
        const roles = UserRole;
        return {data: {"roles": roles, "user": this.user}}
    }

    @Get('/edit/:id')
    @Render('user/edit')
    async edit(@Param('id') id: string) {
        const user = await this.userHttp.show(id).toPromise();
        const roles = UserRole;
        return {data: {"editUser": user, "roles": roles, "user": this.user}};
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
