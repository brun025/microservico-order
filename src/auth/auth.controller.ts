import {Controller, Get, Post, Redirect, Render, Req, Request, UnauthorizedException} from '@nestjs/common';
import { close, mkdir, open, readFileSync, write, writeFile, writeFileSync } from 'fs';
import {AuthService} from "./auth.service";

@Controller('')
export class AuthController {

    baseUrl = process.env.MICRO_DRIVERS_URL;

    constructor(
        private readonly authHttp: AuthService
    ) {

    }

    @Get('/login')
    @Render('auth/login')
    async create() {
        return;
    }

    @Post('/authenticate')
    @Redirect('/orders')
    async store(@Req() request: Request) {
        const result = await this.authHttp.post(request.body).toPromise();
        // console.log(result)
        if(result.data.user == undefined)
            throw new UnauthorizedException('Credenciais inválidas');

        try {
            let path = 'teste.json';
            let buffer = new Buffer(JSON.stringify(result.data.user));

            // open the file in writing mode, adding a callback function where we do the actual writing
            open(path, 'w', function(err, fd) {
                if (err) {
                    throw 'could not open file: ' + err;
                }

                // write the contents of the buffer, from position 0 to the end, to the file descriptor returned in opening our file
                write(fd, buffer, 0, buffer.length, null, function(err) {
                    if (err) throw 'error writing file: ' + err;
                    close(fd, function() {
                        console.log('wrote the file successfully');
                    });
                });
            });
        } catch (error) {
            console.log('Error writing')
        }
    }

    @Get('/logout')
    @Redirect('/login')
    get() {
        try {
            let path = 'teste.json';
            let buffer = new Buffer(JSON.stringify({}));

            // open the file in writing mode, adding a callback function where we do the actual writing
            open(path, 'w', function(err, fd) {
                if (err) {
                    throw 'could not open file: ' + err;
                }

                // write the contents of the buffer, from position 0 to the end, to the file descriptor returned in opening our file
                write(fd, buffer, 0, buffer.length, null, function(err) {
                    if (err) throw 'error writing file: ' + err;
                    close(fd, function() {
                        console.log('wrote the file successfully');
                    });
                });
            });
        } catch (error) {
            console.log('Error writing')
        }
    }

}
