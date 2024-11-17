import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateSessionSchema } from './schemas/CreateSessionSchema';
import { SessionService } from './session.service';
import { UserService } from 'src/user/user.service';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { SessionDto } from './dto/SessionDto';

@ApiTags('Sessions')
@Controller('/sessions')
export class SessionController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly userService: UserService,
    private readonly cacheService: RedisCacheService,
  ) {}

  @ApiOperation({ summary: 'Creates new session' })
  @ApiBody({
    description: 'User data',
    type: CreateSessionSchema,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SessionDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  @Post()
  async createSession(@Body() body: CreateSessionSchema): Promise<SessionDto> {
    const user = await this.userService.findUserByEmailAndPassword(body);

    const token = await this.sessionService.createToken(user.id);

    await this.cacheService.set(
      `token_${user.id}`,
      token,
      +process.env.EXPIRES_IN_MS,
    );

    return new SessionDto(token);
  }

  @ApiOperation({ summary: 'Deletes the session' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Deleted',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid  auth token',
  })
  @HttpCode(204)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteSession(@Request() req): Promise<void> {
    await this.cacheService.remove(`token_${req.user.id}`);

    return;
  }
}
