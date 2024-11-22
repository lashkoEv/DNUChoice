import { DisciplinesDto } from './dto/DisciplinesDto';
import { DisciplineDto } from './dto/DisciplineDto';
import { JwtAuthGuard } from '../guards/jwt.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DisciplineService } from './discipline.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateOrUpdateDisciplineSchema } from './schemas/CreateOrUpdateDisciplineSchema';
import { GroupDto } from '../group/dto/GroupDto';
import { PaginationSchema } from '../resources/dto/PaginationSchema';
import { NumberIdSchema } from '../resources/dto/NumberIdSchema';

@ApiTags('Disciplines')
@Controller('/api/disciplines')
export class DisciplineController {
  constructor(private readonly disciplineService: DisciplineService) {}

  @ApiOperation({ summary: 'Creates new discipline' })
  @ApiBody({
    description: 'Discipline data',
    type: CreateOrUpdateDisciplineSchema,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Success',
    type: GroupDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: CreateOrUpdateDisciplineSchema) {
    const result = await this.disciplineService.create(body);

    return new DisciplineDto(result);
  }

  @ApiOperation({ summary: 'Gets all disciplines' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: DisciplinesDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query() query: PaginationSchema) {
    const scopes = [];
    let disciplines = [];

    if (query.limit || query.offset) {
      scopes.push({ method: ['byPage', query.limit, query.offset] });
    }

    const count = await this.disciplineService.count(scopes);

    if (count) {
      scopes.push('withUsers');

      disciplines = await this.disciplineService.findAll(scopes);
    }

    return new DisciplinesDto(count, disciplines);
  }

  @ApiOperation({ summary: 'Gets a discipline with specified id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: DisciplineDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param() params: NumberIdSchema) {
    const result = await this.disciplineService.findOne(params.id, []);

    return new DisciplineDto(result);
  }

  @ApiOperation({ summary: 'Updates a discipline with specified id' })
  @ApiBody({
    description: 'Discipline data',
    type: CreateOrUpdateDisciplineSchema,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: DisciplineDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param() params: NumberIdSchema,
    @Body() body: CreateOrUpdateDisciplineSchema,
  ) {
    await this.disciplineService.update(params.id, body);

    const result = await this.disciplineService.findOne(params.id, []);

    return new DisciplineDto(result);
  }

  @ApiOperation({ summary: 'Delete discipline by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param() params: NumberIdSchema) {
    const result = await this.disciplineService.findOne(params.id, []);

    if (result) {
      await this.disciplineService.remove(result);
    }
  }
}
