import { IsNotEmpty } from 'class-validator';

export class SettingsDTO {

    @IsNotEmpty()
    key: string;

    @IsNotEmpty()
    value: string;
}