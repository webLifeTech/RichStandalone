import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-document-sign-modal',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './document-sign-modal.component.html',
  styleUrls: ['./document-sign-modal.component.scss']
})
export class DocumentSignModalComponent {

  @Input() documentIframe: any = null;
  urlSafe: any = null;

  constructor(
    private modal: NgbActiveModal,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.documentIframe);
  }

  confirmModal() {
    // this.modal.dismiss();
    this.modal.close({ confirmed: true });
  }
  closeModal() {
    this.modal.dismiss();
  }
}
