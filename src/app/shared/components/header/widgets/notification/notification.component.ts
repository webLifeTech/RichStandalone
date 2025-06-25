import { Component } from '@angular/core';
import { CabService } from '../../../../services/cab.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationsService } from '../../../../services/notifications.service';
import { GlobalService } from '../../../../services/global.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {


  notificationList: any = [];
  roles: any = {
    "user": "Drivers",
    "user_2": "CarOwner",
    "user_3": "FleetCompany",
    "user_4": "DriverOwnedCar",
    "admin": "Admin",
  }
  public selectedCur: string;
  constructor(
    private cabService: CabService,
    private notifService: NotificationsService,
    public gs: GlobalService
  ) {
    this.selectedCur = localStorage.getItem('currency') || 'usd';
    this.getAllNotifications();
  }

  getCurrency(event: Event) {
    if (event) {
      this.selectedCur = (event.target as HTMLInputElement).value;
      this.cabService.currency = (event.target as HTMLInputElement).value;
      localStorage.setItem('currency', (event.target as HTMLInputElement).value)
    }
  }

  getAllNotifications() {
    this.notifService.getAllNotifications().subscribe((apiRes: any) => {
      this.notificationList = apiRes[this.roles[this.gs.loggedInUserInfo.role]]
    });
  }
}
