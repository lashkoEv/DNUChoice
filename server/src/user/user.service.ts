import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { User } from './user.model';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CreateSessionSchema } from 'src/session/schemas/CreateSessionSchema';
import { GroupService } from '../group/group.service';
import { DisciplineService } from '../discipline/discipline.service';
import { StudentDisciplineService } from '../student-discipline/student-discipline.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private readonly groupService: GroupService,
    private readonly disciplineService: DisciplineService,
    private readonly studentDisciplineService: StudentDisciplineService,
    private sequelize: Sequelize,
  ) {}

  async processStudents(data: any[]) {
    try {
      await this.sequelize.transaction(async (transaction) => {
        for (const student of data) {
          const group = await this.groupService.findOrCreate(
            {
              title: student.group,
            },
            transaction,
          );

          const [user] = await this.userModel.findOrCreate({
            where: { email: student.email },
            defaults: {
              name: student.name,
              email: student.email,
              password: await bcrypt.hash('defaultPassword', 10),
              role: 3,
              groupId: group.id,
            },
            transaction,
          });

          for (const disciplineData of student.disciplines) {
            const discipline = await this.disciplineService.findOrCreate(
              disciplineData,
              transaction,
            );

            await this.studentDisciplineService.findOrCreate(
              user.id,
              discipline.id,
              student.forSemester,
              student.forYear,
              transaction,
            );
          }
        }
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getCount(scopes: any[]): Promise<number> {
    try {
      return this.userModel.scope(scopes).count();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll(scopes: any[]): Promise<User[]> {
    try {
      return await this.userModel.scope(scopes).findAll();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findById(id: number, scopes: any[]): Promise<User> {
    const user = await this.userModel.scope(scopes).findByPk(id);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async create(data: any): Promise<User> {
    const saltOrRounds = 10;

    const newData = {
      ...data,
      password: await bcrypt.hash(data.password, saltOrRounds),
    };

    try {
      const user = await this.userModel.create(newData);

      return await this.findById(user.id, ['withGroup']);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async checkUniqueValues(
    id: number,
    property: string,
    value: string,
  ): Promise<User> {
    return this.userModel.findOne({
      where: { [property]: value, id: { [Op.ne]: id } },
    });
  }

  async update(id: number, data: any): Promise<User> {
    const saltOrRounds = 10;

    const newData = {
      ...data,
    };

    const user = await this.findById(id, []);

    try {
      if (await this.checkUniqueValues(id, 'email', newData.email)) {
        throw new BadRequestException('Email must be unique!');
      }

      if (newData.password) {
        const isMatch = await bcrypt.compare(newData.password, user.password);

        let password = user.password;

        if (!isMatch) {
          password = await bcrypt.hash(newData.password, saltOrRounds);
        }

        newData.password = password;
      } else {
        delete newData.password;
      }

      return await user.update(newData);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findUserByEmailAndPassword(data: CreateSessionSchema): Promise<User> {
    const user = await this.userModel.findOne({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new UnprocessableEntityException('Invalid credentials!');
    }

    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) {
      throw new UnprocessableEntityException('Invalid credentials!');
    }

    return user;
  }

  async delete(user: User) {
    await user.destroy();
  }
}
