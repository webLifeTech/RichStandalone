import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-webview-url-modal',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './webview-url-modal.component.html',
  styleUrls: ['./webview-url-modal.component.scss']
})
export class WebViewUrlModalComponent {

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
    this.modal.close({ confirmed: true });
  }

  closeModal() {
    this.modal.close({ confirmed: true });
  }
}
