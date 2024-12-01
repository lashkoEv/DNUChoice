import {IsBoolean} from "class-validator";

export class SetLockSchema {
  @IsBoolean()
  isLocked: boolean;
}
