import {HttpModule, Module} from '@nestjs/common';
import {UserController} from "./user.controller";
import {User} from "./user.model";
import {TypeOrmModule} from "@nestjs/typeorm";
import { UserService } from './user.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        HttpModule
    ],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule {
}
