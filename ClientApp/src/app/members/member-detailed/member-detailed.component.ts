import { Component, OnInit } from '@angular/core';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from '@kolkov/ngx-gallery';
import { MemberService } from 'src/app/shared/services/member.service';
import { IMember } from 'src/app/shared/models/iMember';

@Component({
  selector: 'app-member-detailed',
  templateUrl: './member-detailed.component.html',
  styleUrls: ['./member-detailed.component.css']
})
export class MemberDetailedComponent implements OnInit {
  member: IMember;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(private memberService: MemberService, private alertify: AlertifyService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ]


    this.loadMember();
  }

  loadMember(): void {
    this.memberService.getMember(+this.activatedRoute.snapshot.paramMap.get('id')).subscribe((response) => {
      this.member = response;
      this.galleryImages = this.getImages();
    })
  }
  getImages(): NgxGalleryImage[] {
    const imageUrls = [];
    for (const photo of this.member.photos) {
      imageUrls.push({
        small: photo?.url,
        medium: photo?.url,
        big: photo?.url
      })
    }
    return imageUrls;
  }

}
