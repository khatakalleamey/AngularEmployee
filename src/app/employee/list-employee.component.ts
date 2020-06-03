import { Component, OnInit } from '@angular/core';
import { IEmployee } from './iemployee';
import { EmployeeService } from './employee.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-list-employee',
  templateUrl: './list-employee.component.html',
  styleUrls: ['./list-employee.component.css']
})
export class ListEmployeeComponent implements OnInit {
  employees: IEmployee[];
 

  constructor(private _router: Router,
    private _employeeService: EmployeeService) { }

  ngOnInit() {
    this._employeeService.getEmployees().subscribe((employeeList) => this.employees = employeeList,
    (err) => console.log(err));
  }

  editButtonClick(employeeid:number){
    this._router.navigate(['/edit', employeeid])
  }



}
