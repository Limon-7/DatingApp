import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/shared/services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};


  constructor(public accountService: AccountService, private toastr: ToastrService, private router: Router) { }

  ngOnInit() {
  }
  login(f): void {
    this.accountService.login(this.model).subscribe(() => {

      this.toastr.success('login sucessfull');
    }, err => {
      this.toastr.error(err);
    }, () => {
      this.router.navigate(['/members']);
    });
  }

  logout(f): void{
    this.accountService.logout();
  }
}
