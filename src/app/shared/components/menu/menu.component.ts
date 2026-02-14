import { Component } from '@angular/core';
import { Menu, NavService } from '../../services/nav.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { ProfileComponent } from '../header/widgets/profile/profile.component';
import { RolePermissionService } from '../../services/rolepermission.service';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    ProfileComponent,

    RouterLink,
    TranslateModule,
    CommonModule
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

  public menuItems: any = [];
  public isOpen: boolean = false;

  constructor(
    public navServices: NavService,
    public authService: AuthService,
    public gs: GlobalService,
    private roleService: RolePermissionService,
  ) {
    // this.menuItems = navServices.MENUITEMS;
    this.GetUsrMenuDetails();
  }

  GetUsrMenuDetails() {
    this.roleService.GetUsrMenuDetails({
      userName: this.gs.loggedInUserInfo.userNameId || "",
      systemId: "tlcHubAuthApp"
    }).subscribe((res: any) => {
      this.menuItems = res.filter((tRow: any) => tRow.parentMenuId == 1);
      for (let i in this.menuItems) {
        let pathObj: any = this.navServices.MENUITEMS.find((item: any) => item.title == this.menuItems[i].name);
        this.menuItems[i].path = pathObj.path;
        this.menuItems[i].queryParams = pathObj.queryParams;
      }
      if (this.authService.isLoggedIn && this.gs.loggedInUserInfo.role !== 'user' && this.gs.loggedInUserInfo.role !== 'helpdesk') {
        this.menuItems.push({
          path: "/cab/hire-drivers/list-view",
          queryParams: { type: 'driver' },
          "menuID": 8,
          "menuName": "Hire Drivers",
          "menuUrl": "/public/services",
          "parentMenuId": 1,
          "isParentMenuId": 0,
          "sortPriority": 7,
          "name": "Hire Drivers",
          "actionName": null,
          "controllerName": null,
          "menuIcon": null,
          "menuClass": null,
          "isActive": true,
          "carrierId": 1,
          "systemId": "tlcHubAuthApp",
          "createdBy": "Narendrababu",
          "createdDate": "10/16/2024",
          "modifiedBy": "Narendrababu",
          "modifiedDate": "10/16/2024",
        })
      }
      this.roleService.menuItems = this.menuItems;
    })
  }

  openSidebar() {
    this.isOpen = true;
  }

  closeSidebar() {
    this.isOpen = false;
  }

  toggleMenu(item: Menu) {
    if (!item.active) {
      this.menuItems.forEach((menu: any) => {
        if (this.menuItems.includes(item)) {
          menu.active = false;
          return;
        }
        if (!menu.children) {
          return false;
        }
        if (menu.children) {
          menu.children.forEach((child: any) => {
            if (menu.children?.includes(item)) {
              child.active = false
            }
            if (child.section) {
              child.section.forEach((sectionChild: any) => {
                if (child.section?.includes(item)) {
                  sectionChild.active = false;
                }
              })
            }
            if (child.children) {
              child.children.forEach((subChild: any) => {
                if (child.children?.includes(item)) {
                  subChild.active = false;
                }
              })
            }
          })
          return;
        } else {
          return;
        }
      })
    }
    item.active = !item.active;
  }
}
