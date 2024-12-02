import {Component, OnInit} from '@angular/core';
import {UserRoles} from '../../enums/userRoles';
import {EducationalLevelLabels, EducationalLevels} from '../../enums/EducationalLevels';
import {CatalogueTypeLabels, CatalogueTypes} from '../../enums/CatalogueTypes';
import {UserService} from '../../services/user.service';
import {MessageService} from 'primeng/api';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: any = null;
  disciplines: any[] = [];
  filteredDisciplines: any[] = [];
  displayEditUserDialog: boolean = false;
  editUserForm: FormGroup;

  catalogueTypes = [
    { label: 'Університетський', value: CatalogueTypes.university },
    { label: 'Факультетський', value: CatalogueTypes.faculty },
  ];

  educationalLevels = [
    { label: 'Бакалаврський', value: EducationalLevels.bachelor },
    { label: 'Магістерський', value: EducationalLevels.master },
    { label: 'Освітньо-науковий', value: EducationalLevels.postgraduate },
  ];

  constructor(private userService: UserService, private messageService: MessageService, private fb: FormBuilder) {
    this.editUserForm = this.fb.group({
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.fetchUser();
  }

  fetchUser() {
    this.userService.getMe().subscribe({
      next: (data: any) => {
        this.user = data;
        this.disciplines = data.disciplines;
        this.filteredDisciplines = data.disciplines;
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
          (foundLevel ? foundLevel.label.toLowerCase().includes(query) : ''.includes(query)) ||
          String(discipline.forSemester).toLowerCase().includes(query) ||
          String(discipline.forYear).toLowerCase().includes(query);
      },
    );
  }

  openEditUserDialog(): void {
    this.displayEditUserDialog = true;
  }

  closeEditUserDialog() {
    this.displayEditUserDialog = false;
    this.editUserForm.reset();
  }

  saveEditedUser() {
    if (this.editUserForm.valid) {
      const updatedUser = {
        password: this.editUserForm.value.password,
        email: this.user.email,
        role: this.user.role,
        groupId: this.user.groupId,
        name: this.user.name,
      }

      this.userService.updateUser(this.user.id, updatedUser).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Успіх!',
            detail: 'Дані успішно оновлено!',
          });
          this.fetchUser();
          this.closeEditUserDialog();
        },
        error: () => {
        },
      });
    }
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
