import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class DisciplineService {
  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private userService: UserService,
  ) {
  }

  private apiUrl = 'http://localhost:3000/api/disciplines';

  getAll(): Observable<any[]> {
    const headers = this.userService.getHeaders();

    return this.http.get<any[]>(`${this.apiUrl}`, { headers }).pipe(
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Помилка отримання даних!',
          detail: 'Не вдалося отримати список дисциплін...',
        });
        throw err;
      }),
    );
  }

  create(data: Object) {
    const headers = this.userService.getHeaders();

    return this.http.post(this.apiUrl, data, { headers }).pipe(
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Помилка створення дисципліни!',
          detail: 'Могла статись помилка на серврі...',
        });
        throw err;
      }),
    );
  }

  delete(disciplineId: number): Observable<void> {
    const headers = this.userService.getHeaders();

    return this.http.delete<void>(`${this.apiUrl}/${disciplineId}`, { headers }).pipe(
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Помилка видалення!',
          detail: 'Не вдалося видалити дисципліну.',
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
          summary: 'Помилка редагування дисципліни!',
          detail: 'Могла статись помилка на серврі...',
        });
        throw err;
      }),
    );
  }
}
