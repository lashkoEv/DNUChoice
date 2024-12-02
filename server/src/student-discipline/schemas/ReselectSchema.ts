import { IsArray } from 'class-validator';
import { RequestSchema } from './CreateStudentDisciplineSchema';

export class ReselectSchema {
  @IsArray()
  toDelete: number[];

  @IsArray()
  reselect: RequestSchema[];
}
