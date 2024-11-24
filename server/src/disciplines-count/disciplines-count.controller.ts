import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { DisciplinesCountService } from './disciplines-count.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { NumberIdSchema } from '../resources/dto/NumberIdSchema';
import { CreateOrUpdateDisciplinesCountSchema } from './schemas/CreateOrUpdateDisciplinesCountSchema';
import { DisciplinesCountDto } from './dto/DisciplinesCountDto';

@ApiTags('DisciplinesCounts')
@Controller('/api/disciplinesCounts')
export class DisciplinesCountController {
  constructor(
    private readonly disciplinesCountService: DisciplinesCountService,
  ) {}

  @ApiOperation({ summary: 'Creates new disciplines count' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Success',
    type: DisciplinesCountDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: CreateOrUpdateDisciplinesCountSchema) {
    const result = await this.disciplinesCountService.create(body);

    return new DisciplinesCountDto(result);
  }

  @ApiOperation({ summary: 'Updates a discipline count with specified id' })
  @ApiBody({
    description: 'Discipline data',
    type: CreateOrUpdateDisciplinesCountSchema,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: DisciplinesCountDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param() params: NumberIdSchema,
    @Body() body: CreateOrUpdateDisciplinesCountSchema,
  ) {
    await this.disciplinesCountService.update(params.id, body);

    const result = await this.disciplinesCountService.findOne(params.id, []);

    return new DisciplinesCountDto(result);
  }
}
