import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FileUploadModule } from "ng2-file-upload";
import { NgxGalleryModule } from "@kolkov/ngx-gallery";
import { TimeagoModule } from "ngx-timeago";

import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { TabsModule } from "ngx-bootstrap/tabs";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { ButtonsModule } from "ngx-bootstrap/buttons";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { HasRoleDirective } from "./directives/has-role.directive";
import { NgxSpinnerModule } from "ngx-spinner";
import { ToastrModule } from "ngx-toastr";
import { RolesModalComponent } from './components/roles-modal/roles-modal.component';
import { ModalModule } from "ngx-bootstrap/modal";

@NgModule({
  declarations: [
    // MemberCardComponent

    HasRoleDirective,
    RolesModalComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,

    FileUploadModule,
    NgxGalleryModule,
    TimeagoModule.forRoot(),

    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    ButtonsModule.forRoot(),
    ModalModule.forRoot(),

    NgxSpinnerModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: "toast-top-right",
      preventDuplicates: true,
    }),
  ],
  exports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    FileUploadModule,
    NgxGalleryModule,
    TimeagoModule,

    NgxSpinnerModule,
    ToastrModule,

    BsDropdownModule,
    TabsModule,
    BsDatepickerModule,
    PaginationModule,
    ButtonsModule,

    // components
    // MemberCardComponent
    HasRoleDirective,
    RolesModalComponent
  ],
})
export class SharedModule {}
