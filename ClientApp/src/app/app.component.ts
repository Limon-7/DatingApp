import { Component, OnInit } from '@angular/core';
import { IUser } from './shared/models/iUser';
import { AccountService } from './shared/services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Dating App';

  constructor(private accountService: AccountService) { }
  ngOnInit() {
    this.setCurrentUser();
  }
  setCurrentUser() {
    const user: IUser = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.accountService.setCurrentUser(user);
    }
  }

}
