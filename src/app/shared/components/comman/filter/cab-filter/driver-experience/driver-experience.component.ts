import { Component } from '@angular/core';
import { driverExperience } from '../../../../data/data/filter/cab';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-driver-experience',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  templateUrl: './driver-experience.component.html',
  styleUrl: './driver-experience.component.scss'
})
export class DriverExperienceComponent {

  public driverExperience = driverExperience;

  public isOpenCapacity: boolean = true;
  public selectedExperience: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router) {
    this.route.queryParams.subscribe((params) => {
      this.selectedExperience = params['experience'] ? params['experience'].split(",") : []
    })
  }

  applyFilter(event: Event) {
    const index = this.selectedExperience.indexOf((event.target as HTMLInputElement).value);  // checked and unchecked value

    if ((event.target as HTMLInputElement).checked) {
      this.selectedExperience.push((event.target as HTMLInputElement).value)
    } else {
      this.selectedExperience.splice(index, 1)
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { experience: this.selectedExperience.length ? this.selectedExperience.join(",") : null },
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
    });
  }

  // check if the item are selected
  checked(item: string) {
    if (this.selectedExperience?.includes(item)) {
      return true;
    }
    return false;
  }

  openCapacity() {
    this.isOpenCapacity = !this.isOpenCapacity;
  }
}
