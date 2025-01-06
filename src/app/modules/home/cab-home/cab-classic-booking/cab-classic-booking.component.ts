import { Component, Input } from '@angular/core';
import { booking } from '../../../../shared/interface/cab';
// import { SharedModule } from '../../../../shared/shared.module';

@Component({
  selector: 'app-cab-classic-booking',
  standalone: true,
  imports: [
    // SharedModule
  ],
  templateUrl: './cab-classic-booking.component.html',
  styleUrls: ['./cab-classic-booking.component.scss']
})
export class CabClassicBookingComponent {

  @Input() booking: booking[] | any;

}
