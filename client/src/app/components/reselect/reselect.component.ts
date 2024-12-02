import {Component, OnInit} from '@angular/core';
import {UserRoles} from '../../enums/userRoles';
import {UserService} from '../../services/user.service';
import {MessageService} from 'primeng/api';
import {EducationalLevelLabels, EducationalLevels} from '../../enums/EducationalLevels';
import {CatalogueTypeLabels, CatalogueTypes} from '../../enums/CatalogueTypes';
import {DisciplineService} from '../../services/discipline.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-reselect',
  templateUrl: './reselect.component.html',
  styleUrl: './reselect.component.css'
})
export class ReselectComponent implements OnInit {
  user: any = [];
  forReselect: any = [];
  filteredDisciplines: any[] = [];
  disciplines: any = [];
  reselect: any[] = [];

  catalogueTypes = [
    { label: 'Університетський', value: CatalogueTypes.university },
    { label: 'Факультетський', value: CatalogueTypes.faculty },
  ];

  educationalLevels = [
    { label: 'Бакалаврський', value: EducationalLevels.bachelor },
    { label: 'Магістерський', value: EducationalLevels.master },
    { label: 'Освітньо-науковий', value: EducationalLevels.postgraduate },
  ];

  constructor(private userService: UserService, private messageService: MessageService, private disciplineService: DisciplineService, private router: Router) {
  }

  ngOnInit(): void {
    this.fetchUser();
  }

  fetchUser() {
    this.userService.getMe().subscribe({
      next: (data: any) => {
        this.user = data;
        this.forReselect = data.disciplines.filter((d: any) => !d.isLocked);
        this.fetchDisciplines();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Помилка!',
          detail: 'Не вдалося завантажити дані про вас...',
        });
      },
    });
  }

  fetchDisciplines() {
    const semester = this.forReselect[0].forSemester;
    const year = this.forReselect[0].forYear;
    const excludesIds = this.user.disciplines.map((discipline: any) => discipline.id);
    this.disciplineService.getBySemesterAndYear(semester, year, excludesIds).subscribe({
      next: (data: any) => {
        this.disciplines = data.data;
        this.filteredDisciplines = [...this.disciplines];
      },
      error: () => {
      },
    });
  }

  applyFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const query = inputElement.value.toLowerCase();

    this.filteredDisciplines = this.disciplines.filter(
      (discipline: any) => {
        const foundType = this.catalogueTypes.find(item => item.value === discipline.catalogueType);
        const foundLevel = this.educationalLevels.find(item => item.value === discipline.educationalLevel);

        return discipline.code.toLowerCase().includes(query) ||
          discipline.title.toLowerCase().includes(query) ||
          (foundType ? foundType.label.toLowerCase().includes(query) : ''.includes(query)) ||
          (foundLevel ? foundLevel.label.toLowerCase().includes(query) : ''.includes(query));
      },
    );
  }

  add(discipline: any) {
    if (this.reselect.find((d: any) => (d.id === discipline.id))) {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка!',
        detail: 'В каталозі вже є дана дисципліна!',
      });

      return;
    }

    if (this.reselect.length >= this.forReselect.length) {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка!',
        detail: 'Ви перевищили кількість дисциплін для перевибору!',
      });

      return;
    }

    this.messageService.add({
      severity: 'success',
      summary: 'Дисципліна додана до списку!',
      detail: `Дисципліна '${discipline.title}' додана до списку.`,
    });

    this.reselect.push(discipline);
  }

  delete(discipline: any) {
    this.reselect = this.reselect.filter(element => element !== discipline);
  }

  confirm() {
    if (this.reselect.length < this.forReselect.length) {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка!',
        detail: `Недостатня кількість дисциплін, оберіть ще ${this.forReselect.length - this.reselect.length}!`,
      });

      return;
    }

    const payloadToDelete = this.forReselect.map((discipline: any) => (discipline.studentDisciplineId));

    const payloadReselect = this.reselect.map((discipline: any) => {
      return {
        studentId: this.user.id,
        disciplineId: discipline.id,
        forSemester: this.forReselect[0].forSemester,
        forYear: this.forReselect[0].forYear,
      }
    });

    this.userService.reselectDisciplines({ toDelete: payloadToDelete, reselect: payloadReselect }).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Успіх!',
          detail: 'Ви успішно переобрали дисципліни!',
        });

        this.router.navigate(['/']);
      },
      error: () => {
      },
    });
  }

  getEducationalLevel(discipline: any) {
    // @ts-ignore
    return EducationalLevelLabels[discipline.educationalLevel] || '';
  }

  getCatalogueType(discipline: any): String {
    // @ts-ignore
    return CatalogueTypeLabels[discipline.catalogueType] || '';
  }

  getRole() {
    return this.userService.getUserRole();
  }

  protected readonly UserRoles = UserRoles;
}
