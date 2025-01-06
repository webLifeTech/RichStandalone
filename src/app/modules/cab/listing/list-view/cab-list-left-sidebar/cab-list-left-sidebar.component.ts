import { Component } from '@angular/core';
import { CabSearchComponent } from '../../widgets/cab-search/cab-search.component';
import { FilterComponent } from '../../../../../shared/components/comman/filter/filter.component';
import { DetailsComponent } from '../../../../../shared/components/comman/details/details.component';

@Component({
  selector: 'app-cab-list-left-sidebar',
  standalone: true,
  imports: [
    CabSearchComponent,
    FilterComponent,
    DetailsComponent,
  ],
  templateUrl: './cab-list-left-sidebar.component.html',
  styleUrl: './cab-list-left-sidebar.component.scss'
})
export class CabListLeftSidebarComponent {

  public bg_image = 'assets/images/cab/breadcrumb.jpg';
  public title = 'cab_list.cab_search';
  public parent = 'menu.home';
  public child = 'cab_list.cab_search';

  public selectedTabValue: string;

  constructor() {


  }

  ngOnInit() {
    document.documentElement.style.setProperty('--theme-color1', '233, 179, 14');
    document.documentElement.style.setProperty('--theme-color2', '233, 179, 14');
  }

  ngOnDestroy() {
    document.documentElement.style.removeProperty('--theme-color1');
    document.documentElement.style.removeProperty('--theme-color2');
  }

}
