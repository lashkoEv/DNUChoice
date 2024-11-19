import {Component, OnInit} from '@angular/core';
import {MessageService} from 'primeng/api';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {GroupService} from '../../services/group.service';
import {Group} from '../../interfaces/IGroup';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent implements OnInit {
  constructor(private messageService: MessageService, private userService: UserService, private router: Router, private groupService: GroupService) {
  }

  title: string = 'Реєстрація';

  email: string = '';
  password: string = '';
  fullName: string = '';
  group: string = '';
  groups: Group[] = [];


  ngOnInit(): void {
    this.groupService.findAllForRegistration().subscribe(groups => {
      this.groups = groups;
    });
  }

  async onSubmit() {
    const registrationData = {
      email: this.email,
      password: this.password,
      name: this.fullName,
      groupId: this.group,
      role: 3
    };

    await this.userService.register(registrationData).subscribe((data: any) => {
      if (!data) {
        this.messageService.add({ severity: 'error', summary: 'Помилка реєстрації!', detail: 'Перевірте введені дані!' });

        return;
      }

      this.userService.setUser(data);
      this.messageService.add({ severity: 'success', summary: 'Реєстрація успішна!', detail: 'Ви успішно зареєструвалися!' });
      this.router.navigate(['/']);
    });
  }
}
