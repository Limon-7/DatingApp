import { UsernameValidators } from './../../_validators/username.validators';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/shared/services/account.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  @Output() cancleRegisterMode = new EventEmitter();
  user: User;
  registerForm: FormGroup;
  errorMessage: any;
  bsConfig: Partial<BsDatepickerConfig>;

  constructor(private accountService: AccountService, private fb: FormBuilder,
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
      this.accountService.register(this.user).subscribe(() => {
        this.alertify.success('Registration is successful');
        this.router.navigate(['/members']);
      }, err => {
        console.log('err', JSON.stringify(err));
      }
      );
    }
  }
  cancle(): void {
    this.cancleRegisterMode.emit(false);

  }

}
