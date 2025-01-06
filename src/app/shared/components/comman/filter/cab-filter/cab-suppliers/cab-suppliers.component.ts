import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { carSuppliers } from '../../../../../../shared/components/data/data/filter/cab';

@Component({
  selector: 'app-cab-suppliers',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  templateUrl: './cab-suppliers.component.html',
  styleUrl: './cab-suppliers.component.scss'
})
export class CabSuppliersComponent {

  public carSuppliers = carSuppliers;

  public isOpenSupplier: boolean = true;
  public selectedcarSupplier: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router) {
    this.route.queryParams.subscribe((params) => {
      this.selectedcarSupplier = params['car_sup'] ? params['car_sup'].split(",") : []
    })
  }

  applyFilter(event: Event) {
    const index = this.selectedcarSupplier.indexOf((event.target as HTMLInputElement).value);  // checked and unchecked value

    if ((event.target as HTMLInputElement).checked) {
      this.selectedcarSupplier.push((event.target as HTMLInputElement).value)
    } else {
      this.selectedcarSupplier.splice(index, 1)
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { car_sup: this.selectedcarSupplier.length ? this.selectedcarSupplier.join(",") : null },
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
    });
  }

  // check if the item are selected
  checked(item: string) {
    if (this.selectedcarSupplier?.includes(item)) {
      return true;
    }
    return false;
  }

  openSupplier() {
    this.isOpenSupplier = !this.isOpenSupplier;
  }
}

