import { Group } from '../../group/group.model';

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
}
