import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pdf-viewer-modal',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './pdf-viewer-modal.component.html',
  styleUrls: ['./pdf-viewer-modal.component.scss']
})
export class PdfViewerModalComponent {

  @Input() pdfIframe: any = null;
  urlSafe: any = null;

  constructor(
    private modal: NgbActiveModal,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfIframe);
  }

  closeModal() {
    this.modal.dismiss();
  }
}
