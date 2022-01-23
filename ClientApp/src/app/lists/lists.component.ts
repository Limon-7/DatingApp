import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { User } from '../_models/user';
import { Pagination, PaginatedResult } from '../_models/pagination';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {

  user: User;
  pagination: Pagination;
  likesParam: string;
  pageSizeOptions = [{ value: 3, display: 3 }, { value: 10, display: 10 }, { value: 20, display: 20 }];

  constructor(public authService: AuthService, public userService: UserService,
    public route: ActivatedRoute, public alertify: AlertifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['users'].result;
      this.pagination = data['users'].pagination;
    });
    this.likesParam = 'Likers';
    this.pagination.iteamsPerPage = 20;
  }
  loadUsers() {
    this.userService.getUsers(this.pagination.currentPage,
      this.pagination.iteamsPerPage, null, this.likesParam).subscribe((res: PaginatedResult<User>) => {
        this.user = res.result;
        this.pagination = res.pagination;
        console.log('User', this.user);
      }, err => {
        this.alertify.error(err);
      });
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }
  onPageOptionsSeletecd(event: any): void {
    this.pagination.iteamsPerPage = event;
    this.loadUsers();
  }

}
