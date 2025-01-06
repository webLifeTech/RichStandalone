import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { carElectric } from '../../../../../../shared/components/data/data/filter/cab';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cab-electric',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  templateUrl: './cab-electric.component.html',
  styleUrl: './cab-electric.component.scss'
})
export class CabElectricComponent {
  public carElectrics = carElectric;

  public isOpenElectric: boolean = true;
  public selectedcarElectric: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router) {
    this.route.queryParams.subscribe((params) => {
      this.selectedcarElectric = params['car_electric'] ? params['car_electric'].split(",") : []
    })
  }

  applyFilter(event: Event) {
    const index = this.selectedcarElectric.indexOf((event.target as HTMLInputElement).value);  // checked and unchecked value

    if ((event.target as HTMLInputElement).checked) {
      this.selectedcarElectric.push((event.target as HTMLInputElement).value)
    } else {
      this.selectedcarElectric.splice(index, 1)
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { car_electric: this.selectedcarElectric.length ? this.selectedcarElectric.join(",") : null },
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
    });
  }

  // check if the item are selected
  checked(item: string) {
    if (this.selectedcarElectric?.includes(item)) {
      return true;
    }
    return false;
  }

  openElectric() {
    this.isOpenElectric = !this.isOpenElectric;
  }
}
