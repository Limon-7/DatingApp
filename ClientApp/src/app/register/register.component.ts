import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Input() valueFromHome: any;
  @Output() cancleRegisterMode = new EventEmitter();
  model: any = {};
  constructor(private authservice: AuthService) { }

  ngOnInit() {

  }
  register() {
    this.authservice.register(this.model).subscribe(() => {
      console.log('registration successfull');
    }, err => {
      console.log(err);
    });
    // console.log(this.model);
  }
  cancle() {
    this.cancleRegisterMode.emit(false);
    console.log('cancled');
  }

}
