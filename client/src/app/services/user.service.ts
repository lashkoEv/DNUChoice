import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, catchError} from 'rxjs';
import {MessageService} from 'primeng/api';

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
      })
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
    Object.assign(data, {role: 3});

    return this.http.post(this.apiUrl, data).pipe(
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Помилка реєстрації!',
          detail: 'Перевірте введені дані!',
        });
        throw err;
      })
    );
  }
}
