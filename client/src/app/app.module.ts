import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ButtonModule } from 'primeng/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenubarModule } from 'primeng/menubar';
import { HeaderComponent } from './components/header/header.component';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorComponent } from './components/error/error.component';
import { MainComponent } from './components/main/main.component';
import { DropdownModule } from 'primeng/dropdown';
import { PasswordModule } from 'primeng/password';
import { AuthorizationComponent } from './components/authorization/authorization.component';
import { TeacherComponent } from './components/teacher/teacher.component';
import { TableModule } from 'primeng/table';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import { GroupComponent } from './components/group/group.component';
import { ListboxModule } from 'primeng/listbox';
import { StudentComponent } from './components/student/student.component';
import { DisciplineComponent } from './components/discipline/discipline.component';
import { RippleModule } from 'primeng/ripple';
import { StudentChoiceComponent } from './components/student-choice/student-choice.component';
import { ProfileComponent } from './components/profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthorizationComponent,
    RegistrationComponent,
    HeaderComponent,
    ErrorComponent,
    MainComponent,
    TeacherComponent,
    GroupComponent,
    StudentComponent,
    DisciplineComponent,
    StudentChoiceComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    ButtonModule,
    MenubarModule,
    ToastModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    HttpClientModule,
    DropdownModule,
    PasswordModule,
    TableModule,
    ConfirmPopupModule,
    DialogModule,
    ReactiveFormsModule,
    ListboxModule,
    RippleModule
  ],
  providers: [MessageService, ConfirmationService, HttpClient],
  bootstrap: [AppComponent],
})
export class AppModule {
}
