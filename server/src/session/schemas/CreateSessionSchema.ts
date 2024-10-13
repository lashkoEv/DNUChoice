import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateSessionSchema {
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
    description: 'Password',
    nullable: false,
    example: 'password',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  password: string;
}
