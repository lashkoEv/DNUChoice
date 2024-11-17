import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
  Put,
  Query,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupSchema } from './schemas/CreateGroupSchema';
import { UpdateGroupSchema } from './schemas/UpdateGroupSchema';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { GroupDto } from './dto/GroupDto';
import { GroupsDto } from './dto/GroupsDto';
import { NumberIdSchema } from '../resources/dto/NumberIdSchema';
import { PaginationSchema } from '../resources/dto/PaginationSchema';

@ApiTags('Groups')
@Controller('/api/groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @ApiOperation({ summary: 'Creates new group' })
  @ApiBody({
    description: 'Group data',
    type: CreateGroupSchema,
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
  async create(@Body() createGroupDto: CreateGroupSchema) {
    const result = await this.groupService.create(createGroupDto);

    return new GroupDto(result);
  }

  @ApiOperation({ summary: 'Gets all groups' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: GroupsDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @Get()
  async findAll(@Query() query: PaginationSchema) {
    const scopes = [];
    let groups = [];

    if (query.limit || query.offset) {
      scopes.push({ method: ['byPage', query.limit, query.offset] });
    }

    const count = await this.groupService.count(scopes);

    if (count) {
      groups = await this.groupService.findAll(scopes);
    }

    return new GroupsDto(count, groups);
  }

  @ApiOperation({ summary: 'Gets a group with specified id' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Group identifier',
    type: 'integer',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: GroupDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param() params: NumberIdSchema) {
    const result = await this.groupService.findOne(params.id, []);

    return new GroupDto(result);
  }

  @ApiOperation({ summary: 'Updates a group with specified id' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Group identifier',
    type: 'integer',
    example: 1,
  })
  @ApiBody({
    description: 'Group data',
    type: UpdateGroupSchema,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: GroupDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param() params: NumberIdSchema,
    @Body() body: UpdateGroupSchema,
  ) {
    await this.groupService.update(params.id, body);

    const result = await this.groupService.findOne(params.id, []);

    return new GroupDto(result);
  }

  @ApiOperation({ summary: 'Delete group by id' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Group identifier',
    type: 'integer',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param() params: NumberIdSchema) {
    const result = await this.groupService.findOne(params.id, []);

    if (result) {
      await this.groupService.remove(result);
    }
  }
}
