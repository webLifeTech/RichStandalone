import { Component } from '@angular/core';
import { SearchCatLoactionComponent } from './search-cat-loaction/search-cat-loaction.component';
import { CommonModule } from '@angular/common';
import { ServiceListComponent } from './service-list/service-list.component';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    SearchCatLoactionComponent,
    ServiceListComponent,

    CommonModule
  ],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent {

}
