import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Group } from './group.model';
import { Transaction } from 'sequelize';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group)
    private groupModel: typeof Group,
  ) {}

  async findOrCreate(
    data: { title: string },
    transaction: Transaction,
  ): Promise<Group> {
    const [group] = await this.groupModel.findOrCreate({
      where: { title: data.title },
      defaults: { title: data.title },
      transaction,
    });

    return group;
  }

  async count(scopes: any[] = []): Promise<number> {
    try {
      return await this.groupModel.scope(scopes).count();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async create(payload: any) {
    try {
      return await this.groupModel.create(payload);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll(scopes: any[] = []): Promise<Group[]> {
    try {
      return await this.groupModel.scope(scopes).findAll();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findOne(id: number, scopes: any[]) {
    const group = await this.groupModel.scope(scopes).findByPk(id);

    if (!group) {
      throw new NotFoundException();
    }

    return group;
  }

  async update(id: number, data: any) {
    try {
      const group = await this.findOne(id, []);

      return await group.update(data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(group: Group) {
    await group.destroy();
  }

  async updateYear() {
    const groups = await this.groupModel.findAll();

    const ids = groups.map((item) => item.id);

    await Group.increment({ year: 1 }, { where: { id: ids } });
  }
}
