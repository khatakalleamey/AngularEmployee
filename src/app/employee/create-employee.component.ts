
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { Customvalidator } from 'src/shared/customvalidator';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from './employee.service';
import { ISkill } from './iskill';
import { IEmployee } from './iemployee';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {

  employeeForm: FormGroup;
  employee: IEmployee;
  pageTitle: string;

  formErrors = {
    'fullName': '',
    'email': '',
    'confirmEmail': '',
    'emailGroup': '',
    'phone': '',
    'SkillName': '',
    'ExperienceinYears': '',
    'Proficiency': ''
  };

  validationMessages = {
    'fullName': {
      'required': 'Full Name is required.',
      'minlength': 'Full Name must be greater than 2 characters.',
      'maxlength': 'Full Name must be less than 2 characters.',
    },
    'email': {
      'required': 'Email is required.',
      'emailDomain': 'Email Domain should be microsoft.com'
    },
    'confirmEmail': {
      'required': 'Confirm Email is required'
    },
    'emailGroup': {
      'emailMismatch': 'Email and Confirm Email do not match.',
    },
    'phone': {
      'required': 'Phone is required.'
    },
    'SkillName': {
      'required': 'Skill Name is required.',
    },
    'ExperienceinYears': {
      'required': 'Experience is required.',
    },
    'Proficiency': {
      'required': 'Proficiency is required.',
    },
  };

  //  fullNameLength: 0;
  constructor(private fb: FormBuilder,
    private _route: ActivatedRoute,
    private _employeeService: EmployeeService,
    private _router: Router) { }



  ngOnInit(): void {
    // this.employeeForm = new FormGroup({
    //   fullName: new FormControl(),
    //   email: new FormControl(),
    //   skills: new FormGroup({
    //     SkillName: new FormControl(),
    //     ExperienceinYears: new FormControl(),
    //     Proficiency: new FormControl(),
    //   })
    //});

    this.employeeForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      contactpreference: ['email'],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, Customvalidator.emailDomain('microsoft.com')]],
        confirmEmail: ['', Validators.required],
      }, { validator: matchEmails }),
      phone: [''],
      skills: this.fb.array([
        this.addSkillformGroup()
      ])
    });



    this.employeeForm.get('contactpreference').valueChanges.subscribe((data: string) => {
      this.onContactPrefernceChange(data);
    });

    this.employeeForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.employeeForm);
    });

    this._route.paramMap.subscribe(params => {
      const empid = +params.get('id');
      if (empid) {
        this.pageTitle = 'Edit Employee';
        this.getEmployee(empid);
      } else {
        this.pageTitle = 'Create Employee';
        this.employee = {
          id: null,
          fullName: '',
          contactPreference: '',
          email: '',
          phone: null,
          skills: []
        };
      }
    });
    // this.employeeForm.get('skills').valueChanges.subscribe((value: string) => {
    //   console.log(JSON.stringify(value));
    // })
  }



  getEmployee(id: number) {
    this._employeeService.getEmployee(id).subscribe((employee: IEmployee) => {
      this.employee = employee;
      this.editEmployee(employee);
    },
      (err: any) => console.log(err)
    );
  }

  editEmployee(employee: IEmployee) {
    this.employeeForm.patchValue({
      fullName: employee.fullName,
      contactPreference: employee.contactPreference,
      emailGroup: {
        email: employee.email,
        confirmEmail: employee.email
      },
      phone: employee.phone
    });

    this.employeeForm.setControl('skills', this.setExistingSkills(employee.skills));
  }

  setExistingSkills(skillSets: ISkill[]): FormArray {
    const formArray = new FormArray([]);
    skillSets.forEach(s => {
      formArray.push(this.fb.group({
        SkillName: s.SkillName,
        ExperienceinYears: s.ExperienceinYears,
        Proficiency: s.Proficiency
      }));
    });

    return formArray;
  }

  logValidationErrors(group: FormGroup = this.employeeForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      this.formErrors[key] = '';
      if (abstractControl && !abstractControl.valid
        && (abstractControl.touched || abstractControl.dirty || abstractControl.value !== '')) {
        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + ' ';
          }
        }
      }
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }
      if (abstractControl instanceof FormArray) {
        for (const control of abstractControl.controls) {
          if (control instanceof FormGroup) {
            this.logValidationErrors(control);
          }
        }
      }
    });
  }


  addSkillformGroup(): FormGroup {
    return this.fb.group({
      SkillName: ['', Validators.required],
      ExperienceinYears: ['', Validators.required],
      Proficiency: ['beginner', Validators.required],
    });
  }
  addSkillButtonClick(): void {
    (<FormArray>this.employeeForm.get('skills')).push(this.addSkillformGroup());
  }

  removeSkillButtonClick(skillGroupIndex: number): void {
    const skillsFormArray = <FormArray>this.employeeForm.get('skills');
    skillsFormArray.removeAt(skillGroupIndex);
    skillsFormArray.markAsDirty();
    skillsFormArray.markAsTouched();
  }


  onContactPrefernceChange(selectedValue: string) {
    const phoneControl = this.employeeForm.get('phone');
    if (selectedValue === 'phone') {
      phoneControl.setValidators(Validators.required);
    } else {
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }

  // logKeyValuePairs(group: FormGroup): void {
  //   Object.keys(group.controls).forEach((Key: string) => {
  //     const abstractcontrol = group.get(Key);
  //     if (abstractcontrol instanceof FormGroup) {
  //       this.logKeyValuePairs(abstractcontrol);
  //     } else {
  //       console.log('Key' + Key + '&& Value' + abstractcontrol.value);
  //     }
  //   });
  // }


  onSubmit(): void {
    // console.log(this.employeeForm.value);
    // console.log(this.employeeForm.controls.fullName.value);
    // console.log(this.employeeForm.get('fullName').value);
    // console.log(this.employeeForm.dirty);
    // console.log(this.employeeForm.touched);
    this.mapFormValuesToEmployeeModel();
    if (this.employee.id) {
      this._employeeService.updateEmployee(this.employee).subscribe(
        () => this._router.navigate(['list']),
        (err: any) => console.log(err)
      );
    } else {
      this._employeeService.addEmployee(this.employee).subscribe
        (() => this._router.navigate(['list']),
          (err: any) => console.log(err)
        );
    }
  }

  mapFormValuesToEmployeeModel() {
    this.employee.fullName = this.employeeForm.value.fullName;
    this.employee.contactPreference = this.employeeForm.value.contactPreference;
    this.employee.email = this.employeeForm.value.emailGroup.email;
    this.employee.phone = this.employeeForm.value.phone;
    this.employee.skills = this.employeeForm.value.skills;
  }

  onLoadDataClick(): void {
    // this.employeeForm.setValue({
    //   fullName: 'Amey',
    //   email: 'khatakalle@gmail.com',
    //   skills: {
    //     SkillName: 'Java',
    //     ExperienceinYears: 2,
    //     Proficiency: 'intermediate'
    //   }
    // });
    this.logValidationErrors(this.employeeForm);
    console.log(this.employeeForm);
    // this.employeeForm.patchValue({
    //   fullName: 'Amey',
    //   email: 'khatakalle@gmail.com',
    //   skills: {
    //    // SkillName: 'Java',
    //    // ExperienceinYears: 2,
    //    // Proficiency: 'beginner'
    //   }
    // });
  }
}

function matchEmails(group: AbstractControl): { [key: string]: any } | null {
  const emailControl = group.get('email');
  const confirmEmailControl = group.get('confirmEmail');

  if (emailControl.value === confirmEmailControl.value || confirmEmailControl.pristine && confirmEmailControl.value === '') {
    return null;
  } else {
    return { 'emailMismatch': true };
  }
}