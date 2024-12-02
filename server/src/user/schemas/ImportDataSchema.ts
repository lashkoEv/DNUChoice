import {
  IsEmail,
  IsNotEmpty,
  IsString,
  ValidateNested,
  IsArray,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

export class DisciplineSchema {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  title: string;
}

export class StudentSchema {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  group: string;

  @IsInt()
  @IsNotEmpty()
  forSemester: number;

  @IsInt()
  @IsNotEmpty()
  forYear: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DisciplineSchema)
  disciplines: DisciplineSchema[];
}

export class ImportSchema {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudentSchema)
  data: StudentSchema[];
}
