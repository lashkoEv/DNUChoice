import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { StudentDiscipline } from './student-discipline.model';

@Injectable()
export class StudentDisciplineService {
  constructor(
    @InjectModel(StudentDiscipline)
    private disciplineModel: typeof StudentDiscipline,
  ) {}

  async count(scopes: any[] = []): Promise<number> {
    try {
      return await this.disciplineModel.scope(scopes).count();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async create(payload: any) {
    try {
      return await this.disciplineModel.create(payload);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async bulkCreate(payload: any) {
    try {
      const disciplines = await this.disciplineModel.findAll({
        where: {
          studentId: payload[0].studentId,
          disciplineId: payload.map((d) => d.disciplineId),
        },
      });

      if (disciplines.length) {
        return new BadRequestException();
      }
      return await this.disciplineModel.bulkCreate(payload);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll(scopes: any[] = []): Promise<StudentDiscipline[]> {
    try {
      return await this.disciplineModel.scope(scopes).findAll();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findOne(id: number, scopes: any[]) {
    const discipline = await this.disciplineModel.scope(scopes).findByPk(id);

    if (!discipline) {
      throw new NotFoundException();
    }

    return discipline;
  }

  async update(id: number, data: any) {
    try {
      const discipline = await this.findOne(id, []);

      return await discipline.update(data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(discipline: StudentDiscipline) {
    await discipline.destroy();
  }
}
