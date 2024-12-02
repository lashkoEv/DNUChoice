import { IsArray, IsInt, IsNotEmpty } from 'class-validator';

export class RequestSchema {
  @IsInt()
  @IsNotEmpty()
  disciplineId: number;

  @IsInt()
  @IsNotEmpty()
  forSemester: number;

  @IsInt()
  @IsNotEmpty()
  forYear: number;

  @IsInt()
  @IsNotEmpty()
  studentId: number;
}

export class CreateStudentDisciplineSchema {
  @IsArray()
  data: RequestSchema[];
}
