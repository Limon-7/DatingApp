import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/user';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResult } from '../../_models/pagination';
import { MemberService } from 'src/app/shared/services/member.service';
import { IMember } from 'src/app/shared/models/iMember';

@Component({
  selector: 'app-member-lists',
  templateUrl: './member-lists.component.html',
  styleUrls: ['./member-lists.component.css']
})
export class MemberListsComponent implements OnInit {

  members: IMember[];

  // 
  users: User;
  user: User = JSON.parse(localStorage.getItem('user'));
  genderlist = [{ value: 'Male', display: 'Male' }, { value: 'Female', display: 'Female' }];
  userParams: any = {};
  pagination: Pagination;
  constructor(private memberService: MemberService, private userService: UserService, private altertify: AlertifyService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.memberService.getUsers().subscribe(value => {
      console.log("Memebers-with data:", value);
    })
    this.loadMembers();

    this.userParams.gender = this.user.gender === 'Female' ? 'Male' : 'Female';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.userParams.orderBy = 'lastActive';
  }
  loadMembers() {
    // this.memberService.setUserParams(this.userParams);
    this.memberService.getMembers().subscribe(response => {
      console.log("response:", response);
      this.members = response

    })
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
