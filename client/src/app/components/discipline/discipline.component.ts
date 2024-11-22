import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserService } from '../../services/user.service';
import { Observable, of } from 'rxjs';
import { UserRoles } from '../../enums/userRoles';
import { DisciplineService } from '../../services/discipline.service';
import { EducationalLevelLabels, EducationalLevels } from '../../enums/EducationalLevels';
import { CatalogueTypeLabels, CatalogueTypes } from '../../enums/CatalogueTypes';

@Component({
  selector: 'app-discipline',
  templateUrl: './discipline.component.html',
  styleUrl: './discipline.component.css',
})
export class DisciplineComponent implements OnInit {
  disciplines: any[] = [];
  filteredDisciplines: any[] = [];
  selectedDiscipline: any = null;
  users: any = null;
  displayDisciplineDialog: boolean = false;
  loading: boolean = true;
  displayAddDisciplineDialog: boolean = false;
  addDisciplineForm: FormGroup;
  displayEditDisciplineDialog: boolean = false;
  editDisciplineForm: FormGroup;

  catalogueTypes = [
    { label: 'Університетський', value: CatalogueTypes.university },
    { label: 'Факультетський', value: CatalogueTypes.faculty },
  ];

  educationalLevels = [
    { label: 'Бакалаврський', value: EducationalLevels.bachelor },
    { label: 'Магістерський', value: EducationalLevels.master },
    { label: 'Освітньо-науковий', value: EducationalLevels.postgraduate },
  ];

  semesterOptions = [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '1, 2', value: '1, 2' },
  ];

  constructor(
    private disciplineService: DisciplineService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private userService: UserService,
    private fb: FormBuilder,
  ) {
    this.addDisciplineForm = this.fb.group({
      code: ['', Validators.required],
      title: ['', Validators.required],
      semester: [''],
      year: ['', this.positiveNumberListValidator],
      catalogueType: ['', Validators.required],
      educationalLevel: ['', Validators.required],
      link: ['', this.urlValidator],
    });
    this.editDisciplineForm = this.fb.group({
      codeUpdate: ['', Validators.required],
      titleUpdate: ['', Validators.required],
      semesterUpdate: [''],
      yearUpdate: ['', this.positiveNumberListValidator],
      catalogueTypeUpdate: ['', Validators.required],
      educationalLevelUpdate: ['', Validators.required],
      linkUpdate: ['', this.urlValidator],
    });
  }

  positiveNumberValidator(control: AbstractControl): Observable<{ [key: string]: boolean } | null> {
    if (control.value !== null && control.value <= 0) {
      return of({ positiveNumber: true });
    }

    return of(null);
  }

  positiveNumberListValidator(control: AbstractControl) {
    const value = control.value;
    if (!value || value === '') return null;
    const regex = /^(\d+)(,\s*\d+)*$/;
    return regex.test(value) ? null : { invalidNumberList: true };
  }

  urlValidator(control: AbstractControl) {
    const value = control.value;
    if (!value || value === '') return null;
    const urlPattern = /^https:\/\/.*/;
    return urlPattern.test(value) ? null : { invalidUrl: true };
  }

  onSemesterInputAdd(event: any): void {
    const value = event.target.value;
    if (value && +value < 1) {
      this.addDisciplineForm.get('semester')?.setValue('');
    }
  }

  onSemesterInputEdit(event: any): void {
    const value = event.target.value;
    if (value && +value < 1) {
      this.editDisciplineForm.get('semesterUpdate')?.setValue('');
    }
  }

  onYearInputAdd(event: any): void {
    const value = event.target.value;
    if (value && +value < 1) {
      this.addDisciplineForm.get('year')?.setValue('');
    }
  }

  onYearInputEdit(event: any): void {
    const value = event.target.value;
    if (value && +value < 1) {
      this.editDisciplineForm.get('yearUpdate')?.setValue('');
    }
  }

  ngOnInit(): void {
    this.fetchDisciplines();
  }

  fetchDisciplines() {
    this.loading = true;
    this.disciplineService.getAll().subscribe({
      next: (data: any) => {
        this.disciplines = data.data;
        this.filteredDisciplines = [...this.disciplines];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  applyFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const query = inputElement.value.toLowerCase();

    this.filteredDisciplines = this.disciplines.filter(
      (discipline) => {
        const foundType = this.catalogueTypes.find(item => item.value === discipline.catalogueType);
        const foundLevel = this.educationalLevels.find(item => item.value === discipline.educationalLevel);

        return String(discipline.id).toLowerCase().includes(query) ||
          discipline.code.toLowerCase().includes(query) ||
          discipline.title.toLowerCase().includes(query) ||
          (discipline.semester ? discipline.semester.toLowerCase().includes(query) : '-'.includes(query)) ||
          (discipline.year ? discipline.year.toLowerCase().includes(query) : '-'.includes(query)) ||
          (foundType ? foundType.label.toLowerCase().includes(query) : ''.includes(query)) ||
          (foundLevel ? foundLevel.label.toLowerCase().includes(query) : ''.includes(query));
      },
    );
  }

  confirmDelete(event: Event, disciplineId: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Ви впевнені, що хочете видалити дисципліну?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Так',
      rejectLabel: 'Ні',
      accept: () => {
        this.deleteDiscipline(disciplineId);
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Скасовано!',
          detail: 'Видалення дисципліни скасовано.',
        });
      },
    });
  }

  deleteDiscipline(disciplineId: number) {
    this.disciplineService.delete(disciplineId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Видалення пройшло успішно!',
          detail: `Дисциплну з ID ${disciplineId} успішно видалено!`,
        });
        this.fetchDisciplines();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Помилка!',
          detail: 'Не вдалося видалити дисциплну.',
        });
      },
    });
  }

  viewDisciplineDetails(discipline: any) {
    this.selectedDiscipline = discipline;
    this.users = discipline.users;
    this.displayDisciplineDialog = true;
  }

  openAddDisciplineDialog() {
    this.displayAddDisciplineDialog = true;
  }

  closeAddDisciplineDialog() {
    this.displayAddDisciplineDialog = false;
    this.addDisciplineForm.reset();
  }

  saveDiscipline() {
    if (this.addDisciplineForm.valid) {
      const newDiscipline = this.addDisciplineForm.value;

      this.disciplineService.create(newDiscipline).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Успіх!',
            detail: 'Дисципліну успішно додано!',
          });
          this.fetchDisciplines();
          this.closeAddDisciplineDialog();
        },
        error: () => {
        },
      });
    }
  }

  editDiscipline(discipline: any) {
    this.selectedDiscipline = discipline;
    this.displayEditDisciplineDialog = true;
    this.editDisciplineForm.patchValue({
      codeUpdate: discipline.code,
      titleUpdate: discipline.title,
      semesterUpdate: discipline.semester || '',
      yearUpdate: discipline.year || '',
      catalogueTypeUpdate: this.catalogueTypes.find(item => item.value === discipline.catalogueType),
      educationalLevelUpdate: this.educationalLevels.find(item => item.value === discipline.educationalLevel),
      linkUpdate: discipline.link || '',
    });
  }

  closeEditDisciplineDialog() {
    this.displayEditDisciplineDialog = false;
    this.editDisciplineForm.reset();
  }

  saveEditedDiscipline() {
    if (this.editDisciplineForm.valid) {
      const updatedDiscipline = {
        code: this.editDisciplineForm.value.codeUpdate,
        title: this.editDisciplineForm.value.titleUpdate,
        catalogueType: this.editDisciplineForm.value.catalogueTypeUpdate.value,
        educationalLevel: this.editDisciplineForm.value.educationalLevelUpdate.value,
      };

      if (this.editDisciplineForm.value.yearUpdate) {
        Object.assign(updatedDiscipline, { year: this.editDisciplineForm.value.yearUpdate });
      }

      if (this.editDisciplineForm.value.semesterUpdate) {
        Object.assign(updatedDiscipline, { semester: this.editDisciplineForm.value.semesterUpdate });
      }

      if (this.editDisciplineForm.value.linkUpdate) {
        Object.assign(updatedDiscipline, { link: this.editDisciplineForm.value.linkUpdate });
      }

      this.disciplineService.update(this.selectedDiscipline.id, updatedDiscipline).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Успіх!',
            detail: 'Дані про дисципліну успішно оновлено!',
          });
          this.fetchDisciplines();
          this.closeEditDisciplineDialog();
        },
        error: () => {
        },
      });
    }
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
