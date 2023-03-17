import { IsNotEmpty } from 'class-validator';

export class CreateWidgetDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  rows: number;

  @IsNotEmpty()
  cols: number;

  @IsNotEmpty()
  xpos: number;

  @IsNotEmpty()
  ypos: number;
}
