import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl, ValidationErrors } from '@angular/forms';
import { UsernameValidators } from '../_validators/username.validators';

import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { User } from '../_models/user';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancleRegisterMode = new EventEmitter();
  user: User;
  registerForm: FormGroup;
  errorMessage: any;
  bsConfig: Partial<BsDatepickerConfig>;

  constructor(private authservice: AuthService, private fb: FormBuilder,
    private alertify: AlertifyService, private router: Router) { }

  ngOnInit() {
    this.bsConfig = {
      containerClass: 'theme-red'
    };
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      gender: ['',],
      userName: ['', [
        Validators.required, Validators.minLength(3), Validators.maxLength(8),
        UsernameValidators.cannotContainSpace
      ], [UsernameValidators.shouldBeUnique]],
      knownAs: ['', Validators.required],
      dateOfBirth: [null, Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }
  get username() {
    return this.registerForm.get('userName');
  }
  get knownAs() {
    return this.registerForm.get('knownAs');
  }
  get dateOfBirth() {
    return this.registerForm.get('dateOfBirth');
  }
  get city() {
    return this.registerForm.get('city');
  }
  get country() {
    return this.registerForm.get('country');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value ? null : { 'mismatch': true };
  }
  register() {
    if (this.registerForm.valid) {
      this.user = Object.assign({}, this.registerForm.value);
      this.authservice.register(this.user).subscribe(() => {
        this.alertify.success('Registration is successful');
      }, err => {
        // this.errorMessage=err;

        // this.alertify.error(err);
        console.log('err', JSON.stringify(err));
      }, () => {
        this.authservice.login(this.user).subscribe(() => {
          this.router.navigate(['/members']);
        });
      });
    }
  }
  cancle() {
    this.cancleRegisterMode.emit(false);

  }

}
