import { Component, Input } from '@angular/core';
import { CabService } from '../../../../shared/services/cab.service';
import { testimonial } from '../../../../shared/interface/cab';
import { TestimonialComponent } from '../../../../shared/components/comman/testimonial/testimonial.component';
import { TitleComponent } from '../../../../shared/components/comman/title/title.component';

@Component({
  selector: 'app-cab-classic-testimonial',
  standalone: true,
  imports: [
    TestimonialComponent,
    TitleComponent
  ],
  templateUrl: './cab-classic-testimonial.component.html',
  styleUrls: ['./cab-classic-testimonial.component.scss']
})
export class CabClassicTestimonialComponent {

  @Input() id: any;

  public testimonial: testimonial[] | any;

  constructor(private cabService: CabService) {
    this.cabService.testimonial().subscribe(response => {
      this.testimonial = response.testimonial;

      if (Array.isArray(this.id)) {
        this.testimonial = this.testimonial?.filter((item: any) => {
          return this.id.includes(item.id)
        })
      }
    })
  }
}
