import { Component, OnInit } from '@angular/core';
import { AlertifyService } from '../../_services/alertify.service';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/shared/services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};


  constructor(public accountService: AccountService, private alertifyService: AlertifyService, private router: Router) { }

  ngOnInit() {
  }
  login(f): void {
    this.accountService.login(this.model).subscribe(() => {

      this.alertifyService.success('login sucessfull');
    }, err => {
      this.alertifyService.error(err);
    }, () => {
      this.router.navigate(['/members']);
    });
  }
}
