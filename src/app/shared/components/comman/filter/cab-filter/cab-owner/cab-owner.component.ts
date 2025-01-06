import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { carOwner } from '../../../../../../shared/components/data/data/filter/cab';

@Component({
  selector: 'app-cab-owner',
  standalone: true,
  imports: [
    TranslateModule
  ],
  templateUrl: './cab-owner.component.html',
  styleUrl: './cab-owner.component.scss'
})
export class CabOwnerComponent {

  public carOwner = carOwner;

  public isOpenSupplier: boolean = true;
  public selectedCarOwnerType: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router) {
    this.route.queryParams.subscribe((params) => {
      this.selectedCarOwnerType = params['owner_type'] ? params['owner_type'].split(",") : []
    })
  }

  applyFilter(event: Event) {
    const index = this.selectedCarOwnerType.indexOf((event.target as HTMLInputElement).value);  // checked and unchecked value

    if ((event.target as HTMLInputElement).checked) {
      this.selectedCarOwnerType.push((event.target as HTMLInputElement).value)
    } else {
      this.selectedCarOwnerType.splice(index, 1)
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { owner_type: this.selectedCarOwnerType.length ? this.selectedCarOwnerType.join(",") : null },
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
    });
  }

  // check if the item are selected
  checked(item: string) {
    if (this.selectedCarOwnerType?.includes(item)) {
      return true;
    }
    return false;
  }

  openSupplier() {
    this.isOpenSupplier = !this.isOpenSupplier;
  }
}

