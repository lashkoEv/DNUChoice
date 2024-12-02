import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {UserService} from '../../services/user.service';
import {MessageService, PrimeNGConfig} from 'primeng/api';
import {UserRoles} from '../../enums/userRoles';
import {DisciplineService} from '../../services/discipline.service';
import {EducationalLevelLabels} from '../../enums/EducationalLevels';
import {CatalogueTypeLabels} from '../../enums/CatalogueTypes';
import {Router} from '@angular/router';

@Component({
  selector: 'app-student-choice',
  templateUrl: './student-choice.component.html',
  styleUrl: './student-choice.component.css'
})
export class StudentChoiceComponent implements OnInit {
  user: any = null;
  disciplines: any[] = [];
  activeIndex: number = 0;
  firstTabDisabled: boolean = false;
  secondTabDisabled: boolean = true;
  thirdTabDisabled: boolean = true;
  disciplinesCount: number = 0;
  selectedDisciplines: any[] = [];
  form: FormGroup;

  semesters = [
    {label: 'Перший', value: 1},
    {label: 'Другий', value: 2},
  ];

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router, private messageService: MessageService, private disciplineService: DisciplineService, private primengConfig: PrimeNGConfig) {
    this.form = this.fb.group({
      semester: ['', Validators.required, this.positiveNumberValidator],
      year: ['', Validators.required, this.positiveNumberValidator],
    });
  }

  positiveNumberValidator(control: AbstractControl): Observable<{ [key: string]: boolean } | null> {
    if (control.value !== null && control.value <= 0) {
      return of({positiveNumber: true});
    }

    return of(null);
  }

  setTab(index: number) {
    switch (index) {
      case 0: {
        this.activeIndex = 0;
        this.firstTabDisabled = false;
        this.secondTabDisabled = true;
        this.thirdTabDisabled = true;
        break;
      }
      case 1: {
        this.activeIndex = 1;
        this.firstTabDisabled = true;
        this.secondTabDisabled = false;
        this.thirdTabDisabled = true;
        break;
      }
      case 2: {
        this.activeIndex = 2;
        this.firstTabDisabled = true;
        this.secondTabDisabled = true;
        this.thirdTabDisabled = false;
        break;
      }
    }
  }

  ngOnInit(): void {
    this.fetchUser();

    this.primengConfig.ripple = true;
  }

  fetchUser() {
    this.userService.getMe().subscribe({
      next: (data: any) => {
        this.user = data;
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

  fetchDisciplines(semester: number, year: number) {
    const excludesIds = this.user.disciplines.map((discipline: any) => discipline.id);
    this.disciplineService.getBySemesterAndYear(semester, year, excludesIds).subscribe({
      next: (data: any) => {
        this.disciplines = data.data;
      },
      error: () => {
      },
    });
  }

  loadDisciplines(): void {
    if (this.form.valid) {
      const value = this.form.value;
      if (this.user.disciplines.find((discipline: any) => discipline.forSemester === value.semester.value && discipline.forYear === value.year)) {
        this.messageService.add({
          severity: 'error',
          summary: 'Помилка!',
          detail: 'Ви вже робили вибір для даних курсу і семестру! Для перевибору перейдіть на вкладку "Перевибір"!',
        });
        this.router.navigate(['/']);
        return;
      }
      this.fetchDisciplines(value.semester.value, value.year);
      const choice = this.user.group.disciplinesCounts.find(
        (count: any) => count.toSemester === value.semester.value && count.toYear === value.year
      );
      this.disciplinesCount = choice?.disciplinesCount || 0;
      this.setTab(1);
    }
  }

  choseDisciplines() {
    if (this.selectedDisciplines.length !== this.disciplinesCount) {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка!',
        detail: 'Оберіть правильну кількість дисциплін!',
      });

      return;
    }

    this.setTab(2);
  }

  confirm() {
    const payload = this.selectedDisciplines.map((discipline: any) => {
      return {
        studentId: this.user.id,
        disciplineId: discipline.id,
        forSemester: this.form.value.semester.value,
        forYear: this.form.value.year,
      }
    });

    this.userService.selectDisciplines(payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Успіх!',
          detail: 'Ви успішно обрали дисципліни!',
        });
        this.router.navigate(['/']);
      },
      error: () => {
      },
    });
  }

  getRole() {
    return this.userService.getUserRole();
  }

  getEducationalLevel(discipline: any) {
    // @ts-ignore
    return EducationalLevelLabels[discipline.educationalLevel] || '';
  }

  getCatalogueType(discipline: any): String {
    // @ts-ignore
    return CatalogueTypeLabels[discipline.catalogueType] || '';
  }

  protected readonly UserRoles = UserRoles;
}
