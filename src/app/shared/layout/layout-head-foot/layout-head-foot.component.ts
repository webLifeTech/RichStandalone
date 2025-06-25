import { Component } from '@angular/core';
import { LayoutComponent } from '../../components/ui/layout/layout.component';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout-head-foot',
  standalone: true,
  imports: [
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    RouterOutlet,
    CommonModule
  ],
  templateUrl: './layout-head-foot.component.html',
  styleUrl: './layout-head-foot.component.scss'
})
export class LayoutHeadFootComponent {

  public bg_image = 'assets/images/cab/breadcrumb.jpg';
  public title = 'cab_list.cab_search';
  public parent = 'menu.home';
  public child = 'cab_list.cab_search';

}
