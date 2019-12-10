import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/user';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResult } from '../../_models/pagination';

@Component({
  selector: 'app-member-lists',
  templateUrl: './member-lists.component.html',
  styleUrls: ['./member-lists.component.css']
})
export class MemberListsComponent implements OnInit {
  users: User;
  user: User = JSON.parse(localStorage.getItem('user'));
  genderlist = [{ value: 'Male', display: 'Male' }, { value: 'Female', display: 'Female' }];
  userParams: any = {};
  pagination: Pagination;
  constructor(private userService: UserService, private altertify: AlertifyService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      // tslint:disable-next-line: no-string-literal
      this.users = data['users'].result;
      // tslint:disable-next-line: no-string-literal
      this.pagination = data['users'].pagination;
    });
    this.userParams.gender = this.user.gender === 'Female' ? 'Male' : 'Female';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.userParams.orderBy = 'lastActive';
  }
  resetFilters() {
    this.userParams.gender = this.user.gender === 'Female' ? 'Male' : 'Female';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    // this.userParams.orderBy = 'lastActive';
    this.loadUsers();
  }
  loadUsers() {
    this.userService.getUsers(this.pagination.currentPage,
      this.pagination.iteamsPerPage, this.userParams).subscribe((res: PaginatedResult<User>) => {
        this.users = res.result;
        this.pagination = res.pagination;
      }, err => {
        this.altertify.error(err);
      });
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }
}
