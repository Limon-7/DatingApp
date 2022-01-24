import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  photoUrl: string;


  constructor(public authservice: AuthService, private alertifyService: AlertifyService, private router: Router) { }

  ngOnInit() {
    this.authservice.currentPhotoUrl.subscribe(p => this.photoUrl = p);
  }
  login(f) {
    this.authservice.login(this.model).subscribe((res) => {
      console.log('Login:', res)
      this.alertifyService.success('login sucessfull');
    }, err => {
      this.alertifyService.error(err);
    }, () => {
      this.router.navigate(['/members']);
    });
  }
  loggedIn() {
    // const token = localStorage.getItem('token');
    // return !! token;
    return this.authservice.loggedIn();
  }
  logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authservice.decodedToken = null;
    this.authservice.currentUser = null;
    this.alertifyService.message('logout successfuly');
    this.router.navigate(['/home']);
  }
}
