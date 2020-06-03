import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateEmployeeComponent } from './create-employee.component';
import { ListEmployeeComponent } from './list-employee.component';
import { ReactiveFormsModule } from '@angular/forms'

@NgModule({
  declarations: [
    CreateEmployeeComponent,
    ListEmployeeComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class EmployeeModule { }
