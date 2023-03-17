import { IsNotEmpty } from 'class-validator';

import { EnumType } from '../entities/dashboard.entity';

export class CreateDashboardDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  isPrimary: EnumType;

  isLocked: EnumType;

  @IsNotEmpty()
  createdBy: string;

  modifiedBy: string;
}
