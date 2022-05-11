import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IMember } from '../shared/models/iMember';
import { MemberService } from '../shared/services/member.service';
import { IPaginate } from '../shared/models/iPaginate';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {

  members: Partial<IMember[]>;
  predicate = 'liked';
  pageNumber = 1;
  pageSize = 2;
  pagination: IPaginate;

  pageSizeOptions = [{ value: 3, display: 3 }, { value: 10, display: 10 }, { value: 20, display: 20 }];

  constructor(public memberService: MemberService,
    public route: ActivatedRoute, public toastr: ToastrService) { }

  ngOnInit() {
    this.loadLikes()
  }
  loadLikes() {
    this.memberService.getLikes(this.predicate, this.pageNumber, this.pageSize).subscribe(response => {
      this.members = response.result;
      this.pagination = response.pagination;
    })
  }

  pageChanged(event: any) {
    this.pageNumber = event.page;
    this.loadLikes();
  }

  onPageOptionsSeletecd(event: any): void {
    // this.pagination.itemsPerPage = event;
    // this.loadLikes();
  }

}
