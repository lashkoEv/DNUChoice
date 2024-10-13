import { ApiProperty } from '@nestjs/swagger';

export class SessionDto {
  @ApiProperty({
    description: 'Auth token',
    nullable: false,
    example: 'dhrtyp895yu9g5uj58uh5698hu5698bnu956gmuyj6',
    type: 'string',
  })
  token: string;

  constructor(token: string) {
    this.token = token;
  }
}
