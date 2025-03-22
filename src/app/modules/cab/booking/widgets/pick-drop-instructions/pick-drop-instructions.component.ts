import { Component, Input } from '@angular/core';
import { CabService } from '../../../../../shared/services/cab.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { PickupDropInstructionDialogComponent } from '../../../../../shared/components/dialoge/pickup-drop-instruction-dialog/pickup-drop-instruction-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-pick-drop-instructions',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
  ],
  templateUrl: './pick-drop-instructions.component.html',
  styleUrl: './pick-drop-instructions.component.scss'
})
export class PickDropInstructionsComponent {
  @Input() searchDetails: any = {}
  @Input() bookingDetails: any = {}
  constructor(
    private dialog: MatDialog,
  ) { }

  instructionDialog(type: any) {
    this.dialog.open(PickupDropInstructionDialogComponent, {
      width: '50%',
      position: {
        top: `24px`,
      },
      data: {
        type: type,
        bookingLocationDetails: this.bookingDetails.bookingLocationDetails,
      }
    });
  }

}
