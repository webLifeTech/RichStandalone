import { Component, Input } from '@angular/core';
import { carTypes } from '../../../../shared/interface/cab-classic';
import { CabService } from '../../../../shared/services/cab.service';
import { TitleComponent } from '../../../../shared/components/comman/title/title.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { CurrencySymbolPipe } from '../../../../shared/pipe/currency.pipe';

@Component({
  selector: 'app-cab-classic-car-type',
  standalone: true,
  imports: [
    TitleComponent,

    CarouselModule,

    CurrencySymbolPipe
  ],
  templateUrl: './cab-classic-car-type.component.html',
  styleUrls: ['./cab-classic-car-type.component.scss']
})
export class CabClassicCarTypeComponent {

  @Input() carTypes: carTypes[] | any;

  public description = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci alias aperiam at, aut commodi corporis dolorum ducimus labore magnam mollitia natus porro possimus quae sit tenetur veniam veritatis voluptate voluptatem!";

  public options = {
    loop: true,
    nav: true,
    dots: false,
    center: true,
    navText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>",],
    responsive: {
      0: {
        items: 1,
      },
      575: {
        items: 2,
      },
      767: {
        items: 3,
      },
      999: {
        items: 3,
      },
      1199: {
        items: 3,
      },
    }
  }

  constructor(public cabService: CabService) { }

}
