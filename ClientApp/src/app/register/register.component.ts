import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancleRegisterMode = new EventEmitter();
  model: any = {};
  constructor(private authservice: AuthService) { }

  ngOnInit() {

  }
  register() {
    this.authservice.register(this.model).subscribe(() => {
      console.log('registration successfull');
    }, error => {
      console.log(error);
    });
    // console.log(this.model);
  }
  cancle() {
    this.cancleRegisterMode.emit(false);
    console.log('cancled');
  }

}
