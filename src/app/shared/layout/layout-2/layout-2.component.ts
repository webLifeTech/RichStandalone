import { Component } from '@angular/core';
import { LayoutComponent } from '../../components/ui/layout/layout.component';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BreadcrumbsComponent } from '../../components/comman/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-layout-2',
  standalone: true,
  imports: [
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    BreadcrumbsComponent,
    RouterOutlet,
    CommonModule
  ],
  templateUrl: './layout-2.component.html',
  styleUrl: './layout-2.component.scss'
})
export class Layout2Component {

  public bg_image = 'assets/images/cab/breadcrumb.jpg';
  public title = 'cab_list.cab_search';
  public parent = 'menu.home';
  public parentRoute = '/home';
  public child = 'cab_list.cab_search';

}
