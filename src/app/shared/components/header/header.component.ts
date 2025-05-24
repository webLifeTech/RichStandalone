import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MenuComponent } from '../menu/menu.component';
import { CurrencyComponent } from './widgets/currency/currency.component';
import { SearchTabComponent } from './widgets/search-tab/search-tab.component';
import { ProfileComponent } from './widgets/profile/profile.component';
import { LanguageComponent } from './widgets/language/language.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './widgets/notification/notification.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MenuComponent,
    CurrencyComponent,
    LanguageComponent,
    ProfileComponent,
    SearchTabComponent,
    NotificationComponent,

    RouterLink,
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  @Input() headerClass: string;
  @Input() couponCode: boolean = false;
  @Input() setting: boolean = true;
  @Input() containerFluid: boolean = true;
  @Input() userClass: string = 'user-light';
  @Input() searchTab: boolean = false;
  isNotiShow: boolean = false;

  @Output() searchBoxType = new EventEmitter<string>();

  public isOpen: boolean = false;
  // public logo: string = 'assets/images/icon/footer-logo.png';
  public logo: string = 'assets/images/icon/header-logo.jpg';

  constructor(public authService: AuthService) {

  }
  openMenu() {
    this.isOpen = !this.isOpen;
  }

  getValue(value: string) {
    this.searchBoxType.emit(value)
  }
}
