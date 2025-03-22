import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { GlobalService } from '../../../services/global.service';


@Component({
  selector: 'app-pickup-drop-instruction-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './pickup-drop-instruction-dialog.component.html',
  styleUrl: './pickup-drop-instruction-dialog.component.scss'
})
export class PickupDropInstructionDialogComponent {

  public searchObj: any = {};

  constructor(
    public gs: GlobalService,
    public dialogRef: MatDialogRef<PickupDropInstructionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log("data >>>>>>>>", data);
    this.searchObj = this.gs.getLastSearch();
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
