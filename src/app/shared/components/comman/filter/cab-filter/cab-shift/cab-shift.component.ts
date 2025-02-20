import { Component } from '@angular/core';
import { shiftOptions } from '../../../../data/data/filter/cab';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-cab-shift',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  templateUrl: './cab-shift.component.html',
  styleUrl: './cab-shift.component.scss'
})
export class CabShiftComponent {

  public shiftOptions = shiftOptions;

  public isOpenOption: boolean = true;
  public selectedCarOption: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router) {
    this.route.queryParams.subscribe((params) => {
      this.selectedCarOption = params['car_option'] ? params['car_option'].split(",") : []
    })
  }

  applyFilter(event: Event) {
    const index = this.selectedCarOption.indexOf((event.target as HTMLInputElement).value);  // checked and unchecked value

    if ((event.target as HTMLInputElement).checked) {
      this.selectedCarOption.push((event.target as HTMLInputElement).value)
    } else {
      this.selectedCarOption.splice(index, 1)
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { car_option: this.selectedCarOption.length ? this.selectedCarOption.join(",") : null },
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
    });
  }

  // check if the item are selected
  checked(item: string) {
    if (this.selectedCarOption?.includes(item)) {
      return true;
    }
    return false;
  }

  openOption() {
    this.isOpenOption = !this.isOpenOption;
  }
}
