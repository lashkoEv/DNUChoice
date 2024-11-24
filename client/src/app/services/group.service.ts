import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private groupsSubject = new BehaviorSubject<any[]>([]);
  public groups$ = this.groupsSubject.asObservable();

  private apiUrl = 'http://localhost:3000/api/groups';

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private userService: UserService,
  ) {
  }

  findAllForRegistration(): Observable<any[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((response) => {
        if (response && response.data && Array.isArray(response.data) && response.count) {
          return response.data;
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Помилка!',
            detail: 'Не вдалося отримати дані про групи.',
          });
        }
      }),
      catchError((error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Помилка!',
          detail: 'Не вдалося отримати дані про групи.',
        });
        throw error;
      }),
    );
  }

  create(data: Object) {
    const headers = this.userService.getHeaders();

    return this.http.post(this.apiUrl, data, { headers }).pipe(
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Помилка створення групи!',
          detail: 'Перевірте введені дані! Або могла статись помилка на сервері...',
        });
        throw err;
      }),
    );
  }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`).pipe(
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Помилка отримання даних!',
          detail: 'Не вдалося отримати список груп.',
        });
        throw err;
      }),
    );
  }

  delete(groupId: number): Observable<void> {
    const headers = this.userService.getHeaders();

    return this.http.delete<void>(`${this.apiUrl}/${groupId}`, { headers }).pipe(
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Помилка видалення!',
          detail: 'Не вдалося видалити групу.',
        });
        throw err;
      }),
    );
  }

  update(groupId: number, data: any): Observable<void> {
    const headers = this.userService.getHeaders();

    return this.http.put<any>(`${this.apiUrl}/${groupId}`, data, { headers }).pipe(
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Помилка редагування групи!',
          detail: 'Перевірте введені дані! Або могла статись помилка на сервері...',
        });
        throw err;
      }),
    );
  }

  incrementYear(): Observable<void> {
    const headers = this.userService.getHeaders();

    console.log(headers);
    return this.http.patch<void>(`${this.apiUrl}/year`, {}, { headers }).pipe(
      catchError((err) => {
        throw err;
      }),
    );
  }
}
