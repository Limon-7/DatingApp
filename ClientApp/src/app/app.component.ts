import { Component, OnInit } from '@angular/core';
import { User } from './shared/models/iUser';
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
    const user: User = JSON.parse(localStorage.getItem('user'));
    console.log('User:', user);

    if (user) {
      this.accountService.setCurrentUser(user);
    }
  }

}
