import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    CommonModule
  ],
  providers: [NgbModalConfig, NgbModal],

  // providers: [
  //   NgbActiveModal,
  // ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {

  @Input() modalType: string;
  // @ViewChild(modalType, { static: false }) myDiv: ElementRef;

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  open() {
    // modalType
    // document.getElementById()
    let content = document.getElementById('ButtonX') as HTMLElement;
    this.modalService.open(content);
  }
  // closeModal() {
  //   this.modal.close();
  // }

}
