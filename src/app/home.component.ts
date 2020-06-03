import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {  
  homeTitle:string = 'Employee Management System';
  constructor(private _router: Router) { }

  ngOnInit(): void {
  }

  navigateToList(){
    this._router.navigate(['/list'])
  }

  
  navigateToCreate(){
    this._router.navigate(['/create'])
  }
}
