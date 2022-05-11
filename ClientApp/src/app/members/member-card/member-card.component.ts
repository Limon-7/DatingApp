import { Component, OnInit, Input } from '@angular/core';
import { IMember } from 'src/app/shared/models/iMember';
import { MemberService } from 'src/app/shared/services/member.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  @Input() member: IMember;
  constructor(private memberService: MemberService, private toastr: ToastrService) { }

  ngOnInit() {
  }
  sendLike(recipientId: string) {
    this.memberService.addLike(this.member.userName).subscribe(data => {
      this.toastr.success('you have liked: ' + this.member.knownAs);
    }, err => {
      console.log(err);
      this.toastr.error(err.error);
    });
  }
}
