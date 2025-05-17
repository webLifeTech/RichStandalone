import { Component, Input } from '@angular/core';
import { shiftOptions } from '../../../../data/data/filter/cab';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dynamic-filter',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule
  ],
  templateUrl: './dynamic-filter.component.html',
  styleUrl: './dynamic-filter.component.scss'
})
export class DynamicFilterComponent {

  public shiftOptions = shiftOptions;
  public isOpenOption: boolean = true;
  public selectedCarOption: any = {};
  @Input() filterOBj: any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.selectedCarOption[this.filterOBj.key] = params[this.filterOBj.key] ? params[this.filterOBj.key].split(",") : [];
    })
  }


  applyFilter(event: Event, key: any) {
    const value = (event.target as HTMLInputElement).value;
    let index = this.selectedCarOption[this.filterOBj.key].indexOf(value);  // checked and unchecked value

    if ((event.target as HTMLInputElement).checked) {
      this.selectedCarOption[key].push((event.target as HTMLInputElement).value)
    } else {
      if (key == 'SEATINGCAPACITY' || key == 'EXPERIENCE') {
        const items = value ? value.split(',') : [];
        this.selectedCarOption[key] = this.selectedCarOption[key].filter((item: any) => !items.includes(item));
      } else {
        this.selectedCarOption[key].splice(index, 1);
      }
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { [key]: this.selectedCarOption[key].length ? this.selectedCarOption[key].join(",") : null, ['page']: 1 },
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
    });
  }

  // check if the item are selected
  checked(item: string) {
    if (this.selectedCarOption[this.filterOBj.key]?.includes(item)) {
      return true;
    }
    return false;
  }

  openOption() {
    this.isOpenOption = !this.isOpenOption;
  }
}
