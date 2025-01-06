import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { carSpecs } from '../../../../../../shared/components/data/data/filter/cab';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-cab-specs',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  templateUrl: './cab-specs.component.html',
  styleUrl: './cab-specs.component.scss'
})
export class CabSpecsComponent {
  public caSpecs = carSpecs;

  public isOpenSpec: boolean = true;
  public selectedCaSpec: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router) {
    this.route.queryParams.subscribe((params) => {
      this.selectedCaSpec = params['car_spec'] ? params['car_spec'].split(",") : []
    })
  }

  applyFilter(event: Event) {
    const index = this.selectedCaSpec.indexOf((event.target as HTMLInputElement).value);  // checked and unchecked value

    if ((event.target as HTMLInputElement).checked) {
      this.selectedCaSpec.push((event.target as HTMLInputElement).value)
    } else {
      this.selectedCaSpec.splice(index, 1)
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { car_spec: this.selectedCaSpec.length ? this.selectedCaSpec.join(",") : null },
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
    });
  }

  // check if the item are selected
  checked(item: string) {
    if (this.selectedCaSpec?.includes(item)) {
      return true;
    }
    return false;
  }

  openSpec() {
    this.isOpenSpec = !this.isOpenSpec;
  }
}
