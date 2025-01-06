import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-google-map-modal',
  templateUrl: './google-map-modal.component.html',
  styleUrls: ['./google-map-modal.component.scss']
})
export class GoogleMapModalComponent {

  @Input() filterType: string;

  constructor(private modal: NgbActiveModal){}

  closeModal(){
    this.modal.close();
  }
}
