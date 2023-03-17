import { IsNotEmpty } from 'class-validator';

export class CreateQuizDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  startTime: string;

  @IsNotEmpty()
  endTime: string;
}
