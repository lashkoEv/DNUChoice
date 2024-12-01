import { Component } from '@angular/core';
import {UserRoles} from '../../enums/userRoles';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-reselect',
  templateUrl: './reselect.component.html',
  styleUrl: './reselect.component.css'
})
export class ReselectComponent {
  constructor(private userService: UserService) {
  }


  getRole() {
    return this.userService.getUserRole();
  }

  protected readonly UserRoles = UserRoles;
}
