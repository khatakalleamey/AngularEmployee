import { NgModule, Component } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { ListEmployeeComponent } from './employee/list-employee.component';
import { CreateEmployeeComponent } from './employee/create-employee.component';
import { HomeComponent } from './home.component';
import { PageNotFoundComponent } from './page-not-found.component';


const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'list', component: ListEmployeeComponent },
  { path: 'create', component: CreateEmployeeComponent },
  { path: 'edit/:id', component: CreateEmployeeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
]

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]

})
export class AppRoutingModule { }