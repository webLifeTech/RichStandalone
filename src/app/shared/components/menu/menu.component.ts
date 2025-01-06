import { Component } from '@angular/core';
import { Menu, NavService } from '../../services/nav.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { ProfileComponent } from '../header/widgets/profile/profile.component';

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

  public menuItems: Menu[] = [];
  public isOpen: boolean = false;

  constructor(
    public navServices: NavService,
    public authService: AuthService
  ) {
    this.menuItems = navServices.MENUITEMS;
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
