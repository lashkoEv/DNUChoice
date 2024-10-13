import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import { ObjectId } from 'mongoose';

export class StringIdShema {
  @ApiProperty({
    description: 'Identifier',
    nullable: false,
    example: '187654554658678869547',
    type: 'string',
  })
  @IsMongoId()
  id: ObjectId;
}
