import { IsNotEmpty } from "class-validator";

export class CreateQuestionDto {

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    question: string;

    @IsNotEmpty()
    options: string;

    @IsNotEmpty()
    answer: string;

}
