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
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { NumberIdSchema } from 'src/resources/dto/NumberIdSchema';
import { UsersDto } from './dto/UsersDto';
import { UserDto } from './dto/UserDto';
import { CreateUserSchema } from './schemas/CreateUserSchema';
import { UpdateUserSchema } from './schemas/UpdateUserSchema';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { IUser } from './entities/IUser';
import { Request as ExpressRequest } from 'express';
import { IJwtPayload } from 'src/guards/IJwtPayload';
import { GetAllUsersSchema } from './schemas/GetAllUsersSchema';

@ApiTags('Users')
@Controller('/api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Gets all users' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: UsersDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(
    @Query() query: GetAllUsersSchema,
    @Request() req: ExpressRequest,
  ): Promise<UsersDto> {
    const payload = req.user as IJwtPayload;
    let count = 0;
    let users = [];

    const scopes: any[] = [{ method: ['excludesId', payload.id] }];

    if (query.query) {
      scopes.push({ method: ['byNameOrEmail', query.query] });
    }

    if (query.role) {
      scopes.push({ method: ['byRole', query.role] });
    }

    count = await this.userService.getCount(scopes);

    if (count) {
      scopes.push(
        { method: ['byPage', query.limit, query.offset] },
        'withGroup',
        'withDisciplines',
      );

      users = await this.userService.findAll(scopes);
    }

    return new UsersDto(count, users);
  }

  @ApiOperation({ summary: 'Gets authorized user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: UserDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @Get('/me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getAuthorizedUser(@Request() req: ExpressRequest) {
    const payload = req.user as IJwtPayload;

    const user = await this.userService.findById(payload.id, [
      'withGroup',
      'withDisciplines',
    ]);

    const data = {
      token: payload.token,
    };

    Object.assign(data, user.toJSON());

    return new UserDto(data as IUser);
  }

  @ApiOperation({ summary: 'Gets a user with specified id' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'User identifier',
    type: 'integer',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: UserDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getById(@Param() params: NumberIdSchema): Promise<UserDto> {
    const result = await this.userService.findById(params.id, ['withGroup']);

    return new UserDto(result as IUser);
  }

  @ApiOperation({ summary: 'Creates new user' })
  @ApiBody({
    description: 'User data',
    type: CreateUserSchema,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Success',
    type: UserDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @Post()
  async addUser(@Body() body: CreateUserSchema): Promise<UserDto> {
    const result = await this.userService.create(body);

    return new UserDto(result);
  }

  @ApiOperation({ summary: 'Updates a user with specified id' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'User identifier',
    type: 'integer',
    example: 1,
  })
  @ApiBody({
    description: 'User data',
    type: UpdateUserSchema,
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: UserDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateUser(
    @Param() params: NumberIdSchema,
    @Body() body: UpdateUserSchema,
  ): Promise<UserDto> {
    await this.userService.update(params.id, body);

    const result = await this.userService.findById(params.id, ['withGroup']);

    return new UserDto(result);
  }

  @ApiOperation({ summary: 'Delete user by id' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'User identifier',
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
  async deleteById(@Param() params: NumberIdSchema): Promise<void> {
    const result = await this.userService.findById(params.id, []);

    if (result) {
      await this.userService.delete(result);
    }
  }
}
