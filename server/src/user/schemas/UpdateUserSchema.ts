import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsEmail,
  IsOptional,
  IsInt,
  IsPositive,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

import { userRoles } from 'src/resources/users/userRoles';

const validRoles = Object.keys(userRoles).map(Number);

export class UpdateUserSchema {
  @ApiProperty({
    description: 'Full name',
    nullable: false,
    example: 'John Doe',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  name: string;

  @ApiProperty({
    description: 'Email',
    nullable: false,
    example: 'example@example.com',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Role',
    nullable: false,
    example: '3',
    type: 'number',
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsIn(validRoles, {
    message: `Role must be one of the following values: ${validRoles.join(', ')}`,
  })
  role: number;

  @ApiProperty({
    description: 'Group ID',
    nullable: true,
    example: 1,
    type: 'number',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  groupId?: number = null;

  @ApiProperty({
    description: 'Password',
    nullable: false,
    example: 'password',
    type: 'string',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  password?: string = null;

  constructor() {
    this.groupId = null;
  }
}
