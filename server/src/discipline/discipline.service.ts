import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Discipline } from './discipline.model';
import { Transaction } from 'sequelize';
import { Group } from '../group/group.model';

@Injectable()
export class DisciplineService {
  constructor(
    @InjectModel(Discipline)
    private disciplineModel: typeof Discipline,
  ) {}

  async findOrCreate(
    disciplineData: any,
    transaction: Transaction,
  ): Promise<Discipline> {
    const [discipline] = await this.disciplineModel.findOrCreate({
      where: { code: disciplineData.code },
      defaults: {
        code: disciplineData.code,
        title: disciplineData.title,
      },
      transaction,
    });

    return discipline;
  }

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

  async findAll(scopes: any[] = []): Promise<Discipline[]> {
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

  async remove(discipline: Discipline) {
    await discipline.destroy();
  }
}
