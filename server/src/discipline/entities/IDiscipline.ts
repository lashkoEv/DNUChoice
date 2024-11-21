import { User } from '../../user/user.model';
import { StudentDiscipline } from '../../student-discipline/student-discipline.model';

export interface IDiscipline {
	id: number;
	code: string;
	title: string;
	semester?: number;
	year?: number;
	StudentDiscipline?: StudentDiscipline;
	catalogueType: number;
	educationalLevel: number;
	link?: string;
	createdAt: Date;
	updatedAt: Date;
	users?: User[];
}
