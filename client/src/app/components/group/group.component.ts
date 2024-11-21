import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ConfirmationService, MessageService} from 'primeng/api';
import {GroupService} from '../../services/group.service';
import {Observable, of} from 'rxjs';
import {UserService} from '../../services/user.service';
import {UserRoles} from '../../enums/userRoles';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrl: './group.component.css'
})
export class GroupComponent implements OnInit {
  groups: any[] = [];
  filteredGroups: any[] = [];
  selectedGroup: any = null;
  users: any = null;
  displayGroupDialog: boolean = false;
  loading: boolean = true;
  displayAddGroupDialog: boolean = false;
  addGroupForm: FormGroup;
  displayEditGroupDialog: boolean = false;
  editGroupForm: FormGroup;

  constructor(
    private groupService: GroupService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.addGroupForm = this.fb.group({
      title: ['', Validators.required],
      year: ['', Validators.required, this.positiveNumberValidator]
    });

    this.editGroupForm = this.fb.group({
      titleUpdate: ['', Validators.required],
      yearUpdate: ['', Validators.required, this.positiveNumberValidator]
    });
  }

  positiveNumberValidator(control: AbstractControl): Observable<{ [key: string]: boolean } | null> {
    if (control.value !== null && control.value <= 0) {
      return of({ positiveNumber: true });
    }

    return of(null);
  }

  onYearInputAdd(event: any): void {
    const value = event.target.value;
    if (value && +value < 1) {
      this.addGroupForm.get('year')?.setValue('');
    }
  }

  onYearInputEdit(event: any): void {
    const value = event.target.value;
    if (value && +value < 1) {
      this.editGroupForm.get('yearUpdate')?.setValue('');
    }
  }

  ngOnInit(): void {
    this.fetchGroups();
  }

  fetchGroups() {
    this.loading = true;
    this.groupService.getAll().subscribe({
      next: (data: any) => {
        this.groups = data.data;
        this.filteredGroups = [...this.groups];
        this.loading = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Помилка',
          detail: 'Не вдалося завантажити групи.',
        });
        this.loading = false;
      },
    });
  }

  applyFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const query = inputElement.value.toLowerCase();

    this.filteredGroups = this.groups.filter(
      (group) =>
        String(group.id).toLowerCase().includes(query) ||
        group.title.toLowerCase().includes(query) ||
        String(group.year).toLowerCase().includes(query)
    );
  }

  confirmDelete(event: Event, groupId: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Ви впевнені, що хочете видалити групу?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Так',
      rejectLabel: 'Ні',
      accept: () => {
        this.deleteGroup(groupId);
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Скасовано!',
          detail: 'Видалення групи скасовано.',
        });
      },
    });
  }

  confirmNewYear(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Ви впевнені, що хочете перевести всі групи на наступний курс?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Так',
      rejectLabel: 'Ні',
      accept: () => {
        this.incrementYear();
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Скасовано!',
          detail: 'Переведення груп на наступний курс скасовано.',
        });
      },
    });
  }

  incrementYear() {
    this.groupService.incrementYear().subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Успіх!',
          detail: `Перехід на наступний курс пройшов успішно!`,
        });
        this.fetchGroups();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Помилка!',
          detail: 'Не вдалося перевести групи на наступний курс...',
        });
      },
    });
  }

  deleteGroup(groupId: number) {
    this.groupService.delete(groupId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Видалення пройшло успішно!',
          detail: `Групу з ID ${groupId} успішно видалено!`,
        });
        this.fetchGroups();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Помилка!',
          detail: 'Не вдалося видалити групу.',
        });
      },
    });
  }

  viewGroupDetails(group: any) {
    this.selectedGroup = group;
    this.users = group.users.map((user: any) => ({ name: user.name, code: user.email }))
    this.displayGroupDialog = true;
  }

  openAddGroupDialog() {
    this.displayAddGroupDialog = true;
  }

  closeAddGroupDialog() {
    this.displayAddGroupDialog = false;
    this.addGroupForm.reset();
  }

  saveGroup() {
    if (this.addGroupForm.valid) {
      const newGroup = this.addGroupForm.value;

      this.groupService.create(newGroup).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Успіх!',
            detail: 'Групу успішно додано!'
          });
          this.fetchGroups();
          this.closeAddGroupDialog();
        },
        error: () => {
        }
      });
    }
  }

  editGroup(group: any) {
    this.selectedGroup = group;
    this.displayEditGroupDialog = true;
    this.editGroupForm.patchValue({
      titleUpdate: group.title,
      yearUpdate: group.year,
    });
  }

  closeEditGroupDialog() {
    this.displayEditGroupDialog = false;
    this.editGroupForm.reset();
  }

  saveEditedGroup() {
    if (this.editGroupForm.valid) {
      const updatedGroup = {
        title: this.editGroupForm.value.titleUpdate,
        year: this.editGroupForm.value.yearUpdate,
      }

      this.groupService.update(this.selectedGroup.id, updatedGroup).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Успіх!',
            detail: 'Дані про групу успішно оновлено!'
          });
          this.fetchGroups();
          this.closeEditGroupDialog();
        },
        error: () => {}
      });
    }
  }

  getRole() {
    return this.userService.getUserRole();
  }

  protected readonly UserRoles = UserRoles;
}
