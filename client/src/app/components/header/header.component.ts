import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UserRoles } from '../../enums/userRoles';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  items: any[];
  user$: Observable<any>;

  constructor(private userService: UserService, private router: Router) {
    this.user$ = this.userService.getUser();
    this.items = [];
  }

  ngOnInit() {
    this.user$.subscribe(user => {
      if (user) {
        this.updateMenuItems(user);
      } else {
        this.items = [];
      }
    });
  }

  updateMenuItems(user: any) {
    this.items = [];

    switch (user.role) {
      case UserRoles.admin: {
        this.items.push(
          {
            label: 'Викладачі та адміністратори',
            icon: 'pi pi-user',
            routerLink: ['/teachers'],
          },
          {
            label: 'Студенти',
            icon: 'pi pi-users',
            routerLink: ['/students'],
          },
          {
            label: 'Групи',
            icon: 'pi pi-graduation-cap',
            routerLink: ['/groups'],
          },
          {
            label: 'Дисципліни',
            icon: 'pi pi-file',
            routerLink: ['/disciplines'],
          },
        );
        break;
      }
      case UserRoles.teacher: {
        this.items.push(
          {
            label: 'Студенти',
            icon: 'pi pi-users',
            routerLink: ['/students'],
          },
          {
            label: 'Групи',
            icon: 'pi pi-graduation-cap',
            routerLink: ['/groups'],
          },
          {
            label: 'Дисципліни',
            icon: 'pi pi-file',
            routerLink: ['/disciplines'],
          },
        );
        break;
      }
      case UserRoles.student: {
        this.items.push(
          {
            label: 'Мій профіль',
            icon: 'pi pi-user',
            routerLink: ['/profile'],
          },
          {
            label: 'Обрати дисципліну',
            icon: 'pi pi-plus-circle',
            routerLink: ['/#'],
          },
        );
        break;
      }
    }
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/']);
  }
}
