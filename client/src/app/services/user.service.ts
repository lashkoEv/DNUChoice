import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable } from 'rxjs';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userSubject = new BehaviorSubject<any>(null);

  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient, private messageService: MessageService) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        this.userSubject.next(JSON.parse(storedUser));
      } catch (error) {
        this.messageService.add({
          severity: 'error',
          summary: 'Помилка парсингу!',
          detail: `Помилка при парсингу користувача з localStorage: ${error}`,
        });
        localStorage.removeItem('user');
      }
    }
  }

  authorize(data: Object) {
    return this.http.post('http://localhost:3000/sessions', data).pipe(
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Помилка авторизації!',
          detail: 'Перевірте введені дані!',
        });
        throw err;
      }),
    );
  }

  setUser(data: Object) {
    localStorage.setItem('user', JSON.stringify(data));
    this.userSubject.next(data);
  }

  logout() {
    this.userSubject.next(null);
    localStorage.removeItem('user');
    this.messageService.add({
      severity: 'success',
      summary: 'Вихід успішний!',
      detail: 'Ви успішно вийшли!',
    });
  }

  getUser() {
    return this.userSubject.asObservable();
  }

  register(data: Object) {
    return this.http.post(this.apiUrl, data).pipe(
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Помилка створення облікового запису!',
          detail: 'Перевірте введені дані! Можливо, користувач з такою поштою вже існує.',
        });
        throw err;
      }),
    );
  }

  getUsersByRole(roles: number[]): Observable<any[]> {
    const user = this.userSubject.getValue();
    const token = user?.session.token;

    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : new HttpHeaders();

    let params = new HttpParams();
    roles.forEach(role => {
      params = params.append('role', role.toString());
    });

    return this.http.get<any[]>(`${this.apiUrl}`, { headers, params }).pipe(
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Помилка отримання даних!',
          detail: 'Не вдалося отримати список користувачів.',
        });
        throw err;
      }),
    );
  }

  deleteUser(userId: number): Observable<void> {
    const user = this.userSubject.getValue();
    const token = user?.session.token;

    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : new HttpHeaders();

    return this.http.delete<void>(`${this.apiUrl}/${userId}`, { headers }).pipe(
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Помилка видалення!',
          detail: 'Не вдалося видалити користувача.',
        });
        throw err;
      }),
    );
  }

  getMe(): Observable<void> {
    const user = this.userSubject.getValue();
    const token = user?.session.token;

    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : new HttpHeaders();

    return this.http.get<any>(`${this.apiUrl}/me`, { headers }).pipe(
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Помилка отримання даних!',
          detail: 'Не вдалося отримати дані про користувача.',
        });
        this.logout();
        throw err;
      }),
    );
  }

  updateUser(userId: number, data: any) {
    const user = this.userSubject.getValue();
    const token = user?.session.token;

    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : new HttpHeaders();

    return this.http.put<any>(`${this.apiUrl}/${userId}`, data, { headers }).pipe(
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Помилка редагування облікового запису!',
          detail: 'Перевірте введені дані! Можливо, користувач з такою поштою вже існує.',
        });
        throw err;
      }),
    );
  }

  getHeaders() {
    const user = this.userSubject.getValue();
    const token = user?.session.token;

    return token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : new HttpHeaders();
  }

  getUserRole() {
    const user = this.userSubject.getValue();
    return user?.role || '';
  }

  selectDisciplines(payload: any) {
    const headers = this.getHeaders();

    return this.http.post("http://localhost:3000/api/studentDisciplines", {data : payload}, { headers }).pipe(
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Помилка!',
          detail: 'Можливо ви вже обирали ці дисципліни!',
        });
        throw err;
      }),
    );
  }

  setLock(id: number, isLocked: boolean) {
    const headers = this.getHeaders();

    return this.http.patch(`http://localhost:3000/api/studentDisciplines/${id}`, { isLocked }, { headers }).pipe(
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Помилка!',
          detail: 'Можливо сталась помилка на сервері...',
        });
        throw err;
      }),
    );
  }
}
