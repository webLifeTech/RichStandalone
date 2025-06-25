import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-image-file-modal',
  templateUrl: './image-file-modal.component.html',
  styleUrls: ['./image-file-modal.component.scss']
})
export class ImageFileModalComponent {

  @Input() image = "";
  constructor(private modal: NgbActiveModal) { }

  closeModal() {
    this.modal.dismiss();
  }
}
