import {Component} from '@angular/core';
import * as XLSX from 'xlsx';
import {UserRoles} from '../../enums/userRoles';
import {UserService} from '../../services/user.service';
import {MessageService} from 'primeng/api';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent {
  jsonData: any[] = [];
  data: any[] = [];
  form: FormGroup;

  semesters = [
    {label: 'Перший', value: 1},
    {label: 'Другий', value: 2},
  ];

  constructor(private router: Router, private fb: FormBuilder, private userService: UserService, private messageService: MessageService) {
    this.form = this.fb.group({
      semester: ['', Validators.required, this.positiveNumberValidator],
      year: ['', Validators.required, this.positiveNumberValidator],
    });
  }

  positiveNumberValidator(control: AbstractControl): Observable<{ [key: string]: boolean } | null> {
    if (control.value !== null && control.value <= 0) {
      return of({positiveNumber: true});
    }

    return of(null);
  }

  onUpload(event: any) {
    const file = event.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {type: 'array'});

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        this.jsonData = XLSX.utils.sheet_to_json(worksheet, {defval: null});

        this.prepareJson(this.jsonData);
      };

      reader.readAsArrayBuffer(file);
    }
  }

  prepareJson(parsedJson: any[]) {
    const transformedData = parsedJson.map((entry) => {
      const result = {
        email: entry.email,
        name: entry.name,
        group: entry.group,
        disciplines: [],
      };

      Object.keys(entry).forEach((key) => {
        if (key.startsWith("code")) {
          const index = key.replace("code", "");
          const titleKey = `title${index}`;
          if (entry[titleKey]) {
            // @ts-ignore
            result.disciplines.push({
              code: entry[key].trim(),
              title: entry[titleKey].trim(),
            });
          }
        }
      });

      return result;
    });

    this.data = transformedData;
  }

  prepareDisciplines(disciplines: any[]) {
    return disciplines.map((discipline: any) => (`${discipline.code} ${discipline.title}`));
  }

  import() {
    const payload = this.data.map((entry: any) => {
      entry.forSemester = this.form.value.semester.value;
      entry.forYear = this.form.value.year;

      return entry;
    })

    this.userService.importUsers(payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Успіх!',
          detail: 'Дані успішно імпортовано!',
        });

        this.router.navigate(['/']);
      },
      error: () => {
      },
    });
  }

  getRole() {
    return this.userService.getUserRole();
  }

  protected readonly UserRoles = UserRoles;
}
