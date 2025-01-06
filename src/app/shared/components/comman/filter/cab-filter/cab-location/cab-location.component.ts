import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { carLocation } from '../../../../../../shared/components/data/data/filter/cab';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cab-location',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  templateUrl: './cab-location.component.html',
  styleUrl: './cab-location.component.scss'
})
export class CabLocationComponent {
  public carLocations = carLocation;

  public isOpenLocation: boolean = true;
  public selectedCarLocation: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router) {
    this.route.queryParams.subscribe((params) => {
      this.selectedCarLocation = params['car_location'] ? params['car_location'].split(",") : []
    })
  }

  applyFilter(event: Event) {
    const index = this.selectedCarLocation.indexOf((event.target as HTMLInputElement).value);  // checked and unchecked value

    if ((event.target as HTMLInputElement).checked) {
      this.selectedCarLocation.push((event.target as HTMLInputElement).value)
    } else {
      this.selectedCarLocation.splice(index, 1)
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { car_location: this.selectedCarLocation.length ? this.selectedCarLocation.join("1,") : null },
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
    });
  }

  // check if the item are selected
  checked(item: string) {
    if (this.selectedCarLocation?.includes(item)) {
      return true;
    }
    return false;
  }

  openLocation() {
    this.isOpenLocation = !this.isOpenLocation;
  }
}
