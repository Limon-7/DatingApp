import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/user';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-lists',
  templateUrl: './member-lists.component.html',
  styleUrls: ['./member-lists.component.css']
})
export class MemberListsComponent implements OnInit {
  users: User;
  constructor(private userService: UserService, private altertify: AlertifyService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      // tslint:disable-next-line: no-string-literal
      this.users = data['users'];
    });
    // this.loadUsers();
  }
  // loadUsers() {
  //   this.userService.getUsers().subscribe((users: User) => {
  //     this.users = users ;
  //   }, err => {
  //     this.altertify.error(err);
  //   });
  // }
}
