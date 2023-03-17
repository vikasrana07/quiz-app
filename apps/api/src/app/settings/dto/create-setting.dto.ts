import { IsNotEmpty } from 'class-validator';

export class CreateSettingDto {
  @IsNotEmpty()
  key: string;

  @IsNotEmpty()
  value: string;
}
