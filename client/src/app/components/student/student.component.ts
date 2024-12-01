import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserRoles } from '../../enums/userRoles';
import { Group } from '../../interfaces/IGroup';
import { GroupService } from '../../services/group.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrl: './student.component.css',
})
export class StudentComponent {
  users: any[] = [];
  filteredUsers: any[] = [];
  selectedUser: any = null;
  displayUserDialog: boolean = false;
  loading: boolean = true;
  displayEditUserDialog: boolean = false;
  editUserForm: FormGroup;
  groups: Group[] = [];
  disciplines: any = null;

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private groupService: GroupService,
    private fb: FormBuilder,
  ) {
    this.editUserForm = this.fb.group({
      nameUpdate: ['', Validators.required],
      group: ['', Validators.required],
      emailUpdate: ['', [Validators.required, Validators.email]],
      passwordUpdate: ['', []],
    });
  }

  ngOnInit(): void {
    this.fetchUsers();

    this.groupService.findAllForRegistration().subscribe(groups => {
      this.groups = groups;
    });
  }

  fetchUsers() {
    this.loading = true;
    this.userService.getUsersByRole([UserRoles.student]).subscribe({
      next: (data: any) => {
        this.users = data.data;
        this.filteredUsers = [...this.users];
        this.loading = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Помилка',
          detail: 'Не вдалося завантажити користувачів.',
        });
        this.loading = false;
      },
    });
  }

  applyFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const query = inputElement.value.toLowerCase();

    this.filteredUsers = this.users.filter(
      (user) =>
        String(user.id).toLowerCase().includes(query) ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.group ? user.group.title.toLowerCase().includes(query) : 'немає'.includes(query)),
    );
  }

  confirmDelete(event: Event, userId: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Ви впевнені, що хочете видалити користувача?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Так',
      rejectLabel: 'Ні',
      accept: () => {
        this.deleteUser(userId);
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Скасовано',
          detail: 'Видалення користувача скасовано.',
        });
      },
    });
  }

  deleteUser(userId: number) {
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Видалення пройшло успішно!',
          detail: `Користувача з ID ${userId} успішно видалено!`,
        });
        this.fetchUsers();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Помилка!',
          detail: 'Не вдалося видалити користувача.',
        });
      },
    });
  }

  viewUserDetails(user: any) {
    this.selectedUser = user;
    this.disciplines = this.selectedUser.disciplines;
    this.displayUserDialog = true;
  }

  editUser(user: any) {
    this.selectedUser = user;
    this.displayEditUserDialog = true;
    this.editUserForm.patchValue({
      nameUpdate: user.name,
      emailUpdate: user.email,
      group: this.groups.find(group => group.id === user.group?.id) || '',
      passwordUpdate: '',
    });
  }

  closeEditUserDialog() {
    this.displayEditUserDialog = false;
    this.editUserForm.reset();
  }

  saveEditedUser() {
    if (this.editUserForm.valid) {
      const updatedUser = {
        name: this.editUserForm.value.nameUpdate,
        email: this.editUserForm.value.emailUpdate,
        groupId: this.editUserForm.value.group.id,
        role: UserRoles.student,
      };

      if (this.editUserForm.value.passwordUpdate) {
        Object.assign(updatedUser, { password: this.editUserForm.value.passwordUpdate });
      }

      this.userService.updateUser(this.selectedUser.id, updatedUser).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Успіх!',
            detail: 'Дані користувача успішно оновлено!',
          });
          this.fetchUsers();
          this.closeEditUserDialog();
        },
        error: () => {
        },
      });
    }
  }

  confirmLock(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Ви впевнені, що хочете заблокувати дисципліну для перевибору студентом?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Так',
      rejectLabel: 'Ні',
      accept: () => {
        this.lock(id);
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Скасовано',
          detail: 'Блокування дисципліни скасовано.',
        });
      },
    });
  }

  lock(id: number) {
    this.userService.setLock(id, true).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Успіх!',
          detail: 'Ви успішно заблокували дисципліну!',
        });
        this.fetchUsers();
        this.displayUserDialog = false;
      },
      error: () => {
      },
    });
  }

  confirmUnlock(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Ви впевнені, що хочете розблокувати дисципліну для перевибору студентом?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Так',
      rejectLabel: 'Ні',
      accept: () => {
        this.unlock(id);
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Скасовано',
          detail: 'Розблокування дисципліни скасовано.',
        });
      },
    });
  }

  unlock(id: number) {
    this.userService.setLock(id, false).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Успіх!',
          detail: 'Ви успішно розблокували дисципліну!',
        });
        this.fetchUsers();
        this.displayUserDialog = false;
      },
      error: () => {
      },
    });
  }

  getRole() {
    return this.userService.getUserRole();
  }

  protected readonly UserRoles = UserRoles;
}
