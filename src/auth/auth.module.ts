import {HttpModule, Module} from '@nestjs/common';
import {AuthController} from "./auth.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import { AuthService } from './auth.service';

@Module({
    imports: [
        // TypeOrmModule.forFeature([Product]),
        HttpModule
    ],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {
}
