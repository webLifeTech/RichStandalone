import { Component } from '@angular/core';
import { carTypes } from '../../../../../../shared/components/data/data/filter/cab';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-cab-car-type',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  templateUrl: './cab-car-type.component.html',
  styleUrl: './cab-car-type.component.scss'
})
export class CabCarTypeComponent {

  public carTypes = carTypes;

  public isOpenType: boolean = true;
  public selectedCarType: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router) {
    this.route.queryParams.subscribe((params) => {
      this.selectedCarType = params['car_type'] ? params['car_type'].split(",") : []
    })
  }

  applyFilter(event: Event) {
    const index = this.selectedCarType.indexOf((event.target as HTMLInputElement).value);  // checked and unchecked value

    if ((event.target as HTMLInputElement).checked) {
      this.selectedCarType.push((event.target as HTMLInputElement).value)
    } else {
      this.selectedCarType.splice(index, 1)
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { car_type: this.selectedCarType.length ? this.selectedCarType.join(",") : null },
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
    });
  }

  // check if the item are selected
  checked(item: string) {
    if (this.selectedCarType?.includes(item)) {
      return true;
    }
    return false;
  }

  openType() {
    this.isOpenType = !this.isOpenType;
  }
}
