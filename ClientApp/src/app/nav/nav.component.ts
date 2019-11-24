import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { error } from 'util';
import { AlertifyService } from '../services/alertify.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  constructor(public authservice: AuthService, private alertifyService: AlertifyService) { }

  ngOnInit() {
  }
  login(f) {
    this.authservice.login(this.model).subscribe(() => {
      this.alertifyService.success('login sucessfull');
    }, err => {
      this.alertifyService.error(err);
    }
    );
  }
  loggedIn() {
    // const token = localStorage.getItem('token');
    // return !! token;
    return this.authservice.loggedIn();
  }
  logOut() {
    localStorage.removeItem('token');
    this.alertifyService.message('logout successfuly');

  }
}
