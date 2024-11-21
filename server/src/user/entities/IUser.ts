import { Group } from '../../group/group.model';
import { Discipline } from '../../discipline/discipline.model';

export interface IUser {
  id: number;
  name: string;
  email: string;
  role: number;
  groupId: number;
  createdAt: Date;
  updatedAt: Date;
  token?: string;
  group?: Group;
  disciplines?: Discipline[];
}
