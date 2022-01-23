import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { User } from 'src/app/_models/user';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm;
  user: User;
  photoUrl: string;

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(private route: ActivatedRoute, private alertify: AlertifyService,
              private userServices: UserService, private authservice: AuthService) { }

  ngOnInit() {
    this.route.data.subscribe(deta => {
      // tslint:disable-next-line: no-string-literal
      this.user = deta['user'];
    });
    this.authservice.currentPhotoUrl.subscribe(p => this.photoUrl = p);
  }

  updateUser() {
    this.userServices.updateUser(this.authservice.decodedToken.nameid, this.user).subscribe(obserable => {
      this.alertify.success('You profile is update successfully');
      this.editForm.reset(this.user);
    }, err => {
      this.alertify.error(err);
    });
  }
  updatePhoto(photoUrl) {
    this.user.photoUrl = photoUrl;
  }
}
