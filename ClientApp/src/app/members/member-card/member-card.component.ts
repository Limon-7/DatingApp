import { Component, OnInit, Input } from '@angular/core';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { IMember } from 'src/app/shared/models/iMember';
import { MemberService } from 'src/app/shared/services/member.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  @Input() member: IMember;
  constructor(private memberService: MemberService, private altertify: AlertifyService) { }

  ngOnInit() {
  }
  sendLike(recipientId: string) {
    this.memberService.addLike(this.member.userName).subscribe(data => {
      this.altertify.success('you have liked: ' + this.member.knownAs);
    }, err => {
      console.log(err);
      this.altertify.error(err.error);
    });
  }
}
