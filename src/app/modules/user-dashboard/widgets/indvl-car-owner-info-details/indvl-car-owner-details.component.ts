import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CabService } from '../../../../shared/services/cab.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ImageFileModalComponent } from '../../../../shared/components/comman/modal/image-file-modal/image-file-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CarOwnerInfoModalComponent } from '../../comman/modal/car-owner-Info-modal/car-owner-Info-modal.component';

@Component({
  selector: 'app-indvl-car-owner-details',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgxPaginationModule,
    MatMenuModule,
    MatButtonModule,
  ],
  templateUrl: './indvl-car-owner-details.component.html',
  styleUrl: './indvl-car-owner-details.component.scss'
})
export class IndvlCarCwnerDetailsComponent {

  public params: Params;
  public type: any = "";
  @Input() indCarOwnerInfoData: any = {};
  @Input() onlyCarOwnerDetails: boolean;
  @Output() onEditInfo = new EventEmitter<any>();

  constructor(
    public cabService: CabService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private modalService: NgbModal,
  ) {
    this.route.queryParams.subscribe((params) => {
      this.params = params;
      this.type = this.params['type'];
    })
  }

  viewDocumentFile(): void {
    this.dialog.open(ImageFileModalComponent, {
      width: '600px',
      data: {}
    });
  }

  onView(item: any) {
    this.indCarOwnerInfoData.profile_picture = "assets/images/driver/d1.png";
    const modalRef = this.modalService.open(CarOwnerInfoModalComponent, {
      size: 'lg'
    });
    modalRef.componentInstance.singleDetails = this.indCarOwnerInfoData;
    modalRef.result.then((res: any) => {

    }, () => {
    });
  }

  onEdit(item: any, index: any) {
    this.onEditInfo.emit();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
