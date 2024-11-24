import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DisciplinesCount } from './disciplines-count.model';

@Injectable()
export class DisciplinesCountService {
  constructor(
    @InjectModel(DisciplinesCount)
    private disciplineModel: typeof DisciplinesCount,
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

  async findAll(scopes: any[] = []): Promise<DisciplinesCount[]> {
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

  async remove(discipline: DisciplinesCount) {
    await discipline.destroy();
  }
}
