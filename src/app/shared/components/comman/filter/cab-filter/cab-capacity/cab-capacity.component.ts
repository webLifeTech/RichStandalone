import { Component } from '@angular/core';
import { cabCapacity } from '../../../../../../shared/components/data/data/filter/cab';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-cab-capacity',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  templateUrl: './cab-capacity.component.html',
  styleUrl: './cab-capacity.component.scss'
})
export class CabCapacityComponent {

  public cabCapacity = cabCapacity;

  public isOpenCapacity: boolean = true;
  public selectedCapacity: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router) {
    this.route.queryParams.subscribe((params) => {
      this.selectedCapacity = params['capacity'] ? params['capacity'].split(",") : []
    })
  }

  applyFilter(event: Event) {
    const index = this.selectedCapacity.indexOf((event.target as HTMLInputElement).value);  // checked and unchecked value

    if ((event.target as HTMLInputElement).checked) {
      this.selectedCapacity.push((event.target as HTMLInputElement).value)
    } else {
      this.selectedCapacity.splice(index, 1)
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { capacity: this.selectedCapacity.length ? this.selectedCapacity.join(",") : null },
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
    });
  }

  // check if the item are selected
  checked(item: string) {
    if (this.selectedCapacity?.includes(item)) {
      return true;
    }
    return false;
  }

  openCapacity() {
    this.isOpenCapacity = !this.isOpenCapacity;
  }
}
