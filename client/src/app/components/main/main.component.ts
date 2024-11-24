import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserRoles } from '../../enums/userRoles';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent {
  constructor(private userService: UserService, private router: Router) {
  }

  getRole() {
    return this.userService.getUserRole();
  }

  redirect(path: string) {
    setTimeout(() => (this.router.navigate([path])), 400);
  }
  protected readonly UserRoles = UserRoles;
}
