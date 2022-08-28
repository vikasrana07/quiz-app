/* eslint-disable @typescript-eslint/ban-types */
import {
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from 'class-validator';
import { getManager } from 'typeorm';

@ValidatorConstraint({ async: true })
export class UniqueOnDatabaseExistConstraint implements ValidatorConstraintInterface {
    async validate(value: any, args: ValidationArguments) {
        const entity = args.object[`class_entity_${args.property}`];
        return getManager()
            .count(entity, { [args.property]: value })
            .then((count) => count < 1);
    }
}

export function UniqueValidator(entity: Function, validationOptions?: ValidationOptions) {
    validationOptions = { ...{ message: '$value already exists.' }, ...validationOptions };
    return function (object: Object, propertyName: string) {
        console.log(entity)
        object[`class_entity_${propertyName}`] = entity;
    };
}