import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IMember } from 'src/app/shared/models/iMember';
import { AccountService } from 'src/app/shared/services/account.service';
import { MemberService } from 'src/app/shared/services/member.service';
import { take } from 'rxjs/operators';
import { IUser } from 'src/app/shared/models/iUser';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm;
  member: IMember
  user: IUser;
  photoUrl: string;

  // gen = [
  //   { name: "Male" },
  //   { name: "FeMale" },
  // ]

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(private toastr: ToastrService,
    private accountService: AccountService, private memberService: MemberService,) {
    this.accountService.currentUserObservable$.pipe(take(1)).subscribe(user => this.user = user);
  }

  ngOnInit() {
    this.loadMember();
  }
  loadMember() {
    this.memberService.getMember(this.user.userName).subscribe(member => {
      this.member = member;
      console.log("member:", member);
    })
  }

  updateUser() {
    console.log("model:", this.member);
    this.member.gender = "Male"
    this.memberService.updateMember(this.member).subscribe(() => {
      this.toastr.success('Profile updated successfully');
      this.editForm.reset(this.member);
    })

  }

  updatePhoto(photoUrl) {
    this.user.photoUrl = photoUrl;
  }
}
