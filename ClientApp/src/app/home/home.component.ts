import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  toggle: boolean = false;
  registerMode = false;
  constructor(private http: HttpClient, public authService: AuthService) {

  }

  ngOnInit() {
    console.log("current-user:", this.authService.currentUser);
  }
  registerToggle() {
    this.registerMode = true;
  }
  cancelRegister(registerMode: boolean) {
    this.registerMode = false;
  }
  handleClick() {
    this.toggle = !this.toggle;
  }
}
