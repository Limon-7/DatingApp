import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/_models/photo';
import { FileUploader } from 'ng2-file-upload';
import { AuthService } from 'src/app/_services/auth.service';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})


export class PhotoEditorComponent implements OnInit {

  @Input() photos: Photo[];
  @Output() getMemberPhotoChange = new EventEmitter<string>();
  baseUrl = environment.apiUrl;
  uploader: FileUploader;
  hasBaseDropZoneOver: false;
  hasAnotherDropZoneOver: false;
  currentMain: Photo;

  // response:string;
  constructor(private authService: AuthService, private userService: UserService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.initializeUpload();
  }
  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUpload() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'user/' + this.authService.decodedToken.nameid + '/photos/',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      removeAfterUpload: true,
      autoUpload: false,
    });
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onSuccessItem = (item, respose, status, headers) => {
      if (respose) {
        const res: Photo = JSON.parse (respose);
        const photo = {
          id: res.id,
          url: res.url,
          dateAdded: res.dateAdded,
          description: res.description,
          isMain: res.isMain
        };
        this.photos.push(photo);
      }
    };
  }
  setMainPhoto( photo: Photo) {
    this.userService.setMainPhoto(this.authService.decodedToken.nameid, photo.id).subscribe(() => {
      this.currentMain = this.photos.filter(p => p.isMain === true)[0];
      this.currentMain.isMain = false;
      photo.isMain = true;
      this.authService.changeMemberPhoto(photo.url);
      this.authService.currentUser.photoUrl = photo.url;
      localStorage.setItem('user', JSON.stringify(this.authService.currentUser));
      this.alertify.success('Sucessfully set to main');
    }, err => {
      this.alertify.error(err);
    });
  }
  deletePhoto(id: number) {
    this.alertify.confirm('Are you want to delete this photo', () => {
      this.userService.deletePhoto(this.authService.decodedToken.nameid, id)
      .subscribe(() => {
        this.photos.splice(this.photos.findIndex(p => p.id === id), 1 );
        this.alertify.success('Photo has been Deleted');
      }, err => {
        this.alertify.error(err);
      });
    });
  }
}
