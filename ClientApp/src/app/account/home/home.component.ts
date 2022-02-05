import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/shared/services/account.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  toggle: boolean = false;
  registerMode = false;
  constructor(public accountService: AccountService) {
    // this.accountService.currentUserObservable$
  }

  ngOnInit() {
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
