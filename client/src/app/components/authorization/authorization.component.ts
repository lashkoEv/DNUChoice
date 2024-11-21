import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrl: './authorization.component.css',
})
export class AuthorizationComponent {
  constructor(private messageService: MessageService, private userService: UserService, private router: Router) {
  }

  title: string = 'Авторизація';
  email: string = '';
  password: string = '';

  async onSubmit() {
    await this.userService.authorize({ email: this.email, password: this.password }).subscribe((data: any) => {
      if (!data) {
        this.messageService.add({
          severity: 'error',
          summary: 'Помилка авторизації!',
          detail: 'Перевірте введені дані!',
        });

        return;
      }

      this.userService.setUser(data);
      this.messageService.add({
        severity: 'success',
        summary: 'Авторизація успішна!',
        detail: 'Ви успішно авторизувалися!',
      });
      this.router.navigate(['/']);
    });
  }
}
