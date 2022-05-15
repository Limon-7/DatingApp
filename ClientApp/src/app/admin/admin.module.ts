import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { PhotoManagementComponent } from './photo-management/photo-management.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    AdminDashboardComponent,
    UserManagementComponent,
    PhotoManagementComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }
