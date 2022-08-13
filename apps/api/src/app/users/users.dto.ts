import { IsEmail, IsNotEmpty } from 'class-validator';
import { UsersEntity } from './users.entity';

export class UsersDTO {

    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}