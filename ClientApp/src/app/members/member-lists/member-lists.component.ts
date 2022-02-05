import { Component, OnInit } from '@angular/core';
import { MemberService } from 'src/app/shared/services/member.service';
import { IMember } from 'src/app/shared/models/iMember';
import { UserParams } from 'src/app/shared/params/user-params';
import { IUser } from 'src/app/shared/models/iUser';
import { IPaginate } from 'src/app/shared/models/iPaginate';

@Component({
  selector: 'app-member-lists',
  templateUrl: './member-lists.component.html',
  styleUrls: ['./member-lists.component.css']
})
export class MemberListsComponent implements OnInit {

  members: IMember[];
  pagination: IPaginate;

  userParams: UserParams;
  user: IUser;


  genderlist = [{ value: 'Male', display: 'Male' }, { value: 'Female', display: 'Female' }];


  constructor(private memberService: MemberService) {
    this.userParams = this.memberService.getParams();
  }

  ngOnInit() {
    // this.memberService.getUsers().subscribe(value => {
    //   console.log("Memebers-with data:", value);
    // })
    this.loadMembers();
  }
  loadMembers() {
    this.memberService.setParams(this.userParams);
    this.memberService.getMembers(this.userParams).subscribe(response => {
      console.log("response:", response);
      this.members = response.result;
      this.pagination = response.pagination;
    })
  }
  resetFilters() {
    this.userParams = this.memberService.resetUserParams();
    this.loadMembers();
  }
  pageChanged(event: any): void {
    this.userParams.pageNumber = event.page;
    this.memberService.setParams(this.userParams);
    this.loadMembers();
    this.loadMembers();
  }
}
