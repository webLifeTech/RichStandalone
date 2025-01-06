import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-no-data',
  standalone: true,
  imports: [],
  templateUrl: './no-data.component.html',
  styleUrl: './no-data.component.scss'
})
export class NoDataComponent {

  @Input() icon: string;
  @Input() title: string;
  @Input() description: string;
  @Input() ImageClass: boolean = false;

}
