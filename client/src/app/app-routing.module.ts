import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './components/registration/registration.component';
import { ErrorComponent } from './components/error/error.component';
import { MainComponent } from './components/main/main.component';
import { AuthorizationComponent } from './components/authorization/authorization.component';
import { TeacherComponent } from './components/teacher/teacher.component';
import { GroupComponent } from './components/group/group.component';
import { StudentComponent } from './components/student/student.component';
import { DisciplineComponent } from './components/discipline/discipline.component';
import { StudentChoiceComponent } from './components/student-choice/student-choice.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'authorization', component: AuthorizationComponent },
  { path: 'teachers', component: TeacherComponent },
  { path: 'groups', component: GroupComponent },
  { path: 'students', component: StudentComponent },
  { path: 'disciplines', component: DisciplineComponent },
  { path: 'add-disciplines', component: StudentChoiceComponent },
  { path: 'profile', component: StudentChoiceComponent },
  { path: '**', component: ErrorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
