import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { error } from 'util';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  constructor(private authservice: AuthService) { }

  ngOnInit() {
  }
  login(f) {
    this.authservice.login(this.model).subscribe(next => {
      console.log('login sucessfull');
    }, err => {
      console.log('failed');
    }
    );
  }
  loggedIn() {
    const token = localStorage.getItem('token');
    return !!token;
  }
  logOut() {
    localStorage.removeItem('token');
    console.log('logout successfuly');
  }
}
