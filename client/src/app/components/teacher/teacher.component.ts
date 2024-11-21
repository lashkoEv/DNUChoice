import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserRoles} from '../../enums/userRoles';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  selectedUser: any = null;
  displayUserDialog: boolean = false;
  loading: boolean = true;
  displayAddUserDialog: boolean = false;
  addUserForm: FormGroup;
  displayEditUserDialog: boolean = false;
  editUserForm: FormGroup;

  roles = [
    {label: 'Викладач', value: UserRoles.teacher},
    {label: 'Адміністратор', value: UserRoles.admin}
  ];


  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder
  ) {
    this.addUserForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: [null, Validators.required]
    });

    this.editUserForm = this.fb.group({
      nameUpdate: ['', Validators.required],
      emailUpdate: ['', [Validators.required, Validators.email]],
      passwordUpdate: ['', []],
      roleUpdate: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
    this.loading = true;
    this.userService.getUsersByRole([UserRoles.admin, UserRoles.teacher]).subscribe({
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
        user.email.toLowerCase().includes(query)
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
    this.displayUserDialog = true;
  }

  openAddUserDialog() {
    this.displayAddUserDialog = true;
  }

  closeAddUserDialog() {
    this.displayAddUserDialog = false;
    this.addUserForm.reset();
  }

  saveUser() {
    if (this.addUserForm.valid) {
      const newUser = this.addUserForm.value;
      newUser.role = newUser.role.value;

      this.userService.register(newUser).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Успіх!',
            detail: 'Користувача успішно додано!'
          });
          this.fetchUsers();
          this.closeAddUserDialog();
        },
        error: () => {
        }
      });
    }
  }

  editUser(user: any) {
    this.selectedUser = user;
    this.displayEditUserDialog = true;
    this.editUserForm.patchValue({
      nameUpdate: user.name,
      emailUpdate: user.email,
      roleUpdate: user.role === 2 ? this.roles[0] : this.roles[1],
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
        role: this.editUserForm.value.roleUpdate.value,
      }

      if (this.editUserForm.value.passwordUpdate) {
        Object.assign(updatedUser, {password: this.editUserForm.value.passwordUpdate});
      }

      this.userService.updateUser(this.selectedUser.id, updatedUser).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Успіх!',
            detail: 'Дані користувача успішно оновлено!'
          });
          this.fetchUsers();
          this.closeEditUserDialog();
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
