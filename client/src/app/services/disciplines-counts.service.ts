import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { UserService } from './user.service';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DisciplinesCountsService {
  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private userService: UserService,
  ) {
  }

  private apiUrl = 'http://localhost:3000/api/disciplinesCounts';

  create(data: Object) {
    const headers = this.userService.getHeaders();

    return this.http.post(this.apiUrl, data, { headers }).pipe(
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Помилка створення даних про вибір для групи!',
          detail: 'Перевірте введені дані! Або могла статись помилка на сервері...',
        });
        throw err;
      }),
    );
  }

  update(disciplineId: number, data: any): Observable<void> {
    const headers = this.userService.getHeaders();

    return this.http.put<any>(`${this.apiUrl}/${disciplineId}`, data, { headers }).pipe(
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Помилка редагування даних про вибір для групи!',
          detail: 'Перевірте введені дані! Або могла статись помилка на сервері...',
        });
        throw err;
      }),
    );
  }
}
