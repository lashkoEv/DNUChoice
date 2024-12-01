import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { CreateStudentDisciplineSchema } from './schemas/CreateStudentDisciplineSchema';
import { StudentDisciplineService } from './student-discipline.service';
import { NumberIdSchema } from '../resources/dto/NumberIdSchema';
import { SetLockSchema } from './schemas/SetLockSchema';

@ApiTags('StudentDisciplines')
@Controller('/api/studentDisciplines')
export class StudentDisciplineController {
  constructor(
    private readonly studentDisciplineService: StudentDisciplineService,
  ) {}

  @ApiOperation({ summary: 'Select disciplines' })
  @ApiBody({
    description: 'Data',
    type: CreateStudentDisciplineSchema,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Success',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: CreateStudentDisciplineSchema) {
    await this.studentDisciplineService.bulkCreate(body.data);

    return;
  }

  @ApiOperation({ summary: 'Delete chosen discipline by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param() params: NumberIdSchema) {
    const result = await this.studentDisciplineService.findOne(params.id, []);

    if (result) {
      await this.studentDisciplineService.remove(result);
    }
  }

  @ApiOperation({
    summary: 'Updates isLocked field for student discipline with specific id',
  })
  @ApiBody({
    description: 'Data',
    type: SetLockSchema,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param() params: NumberIdSchema, @Body() body: SetLockSchema) {
    await this.studentDisciplineService.update(params.id, body);

    return;
  }
}
