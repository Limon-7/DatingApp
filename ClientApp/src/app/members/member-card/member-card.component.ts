import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { IMember } from 'src/app/shared/models/iMember';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  @Input() member: IMember;
  constructor(private authService: AuthService, private userService: UserService, private altertify: AlertifyService) { }

  ngOnInit() {
  }
  sendLike(recipientId: number) {
    this.userService.sendLike(this.authService.decodedToken.nameid, recipientId).subscribe(data => {
      this.altertify.success('you have liked: ' + this.member.knownAs);
    }, err => {
      this.altertify.error(err);
    });
  }
}
