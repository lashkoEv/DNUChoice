import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { User } from 'src/user/user.model';

@ValidatorConstraint({ name: 'IsUniqueConstraint', async: true })
@Injectable()
export class IsUnique implements ValidatorConstraintInterface {
  constructor(@InjectModel(User) private readonly userModel: typeof User) {}
  async validate(value: any, args?: ValidationArguments): Promise<boolean> {
    const [column] = args.constraints as string[];

    const existingUser = await this.userModel.findOne({
      where: { [column]: value },
    });

    return !existingUser;
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    const field = validationArguments.property;

    return `${field} is already taken!`;
  }
}
