import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MessageService} from 'primeng/api';
import {BehaviorSubject, catchError, map, Observable} from 'rxjs';
import {Group} from '../interfaces/IGroup';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private groupsSubject = new BehaviorSubject<Group[]>([]);
  public groups$ = this.groupsSubject.asObservable();

  private apiUrl = 'http://localhost:3000/api/groups';

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  findAll(): Observable<Group[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((response) => {
        if (response && response.data && Array.isArray(response.data) && response.count) {
          return response.data;
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Помилка!',
            detail: 'Не вдалося отримати дані про групи.'
          });
        }
      }),
      catchError((error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Помилка!',
          detail: 'Не вдалося отримати дані про групи.'
        });
        throw error;
      })
    );
  }
}
