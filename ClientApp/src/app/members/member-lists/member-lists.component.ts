import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { AlertifyService } from '../../services/alertify.service';
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
