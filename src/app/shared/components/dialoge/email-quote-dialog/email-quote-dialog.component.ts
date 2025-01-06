import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-email-quote-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule
    // TranslateModule
  ],
  templateUrl: './email-quote-dialog.component.html',
  styleUrl: './email-quote-dialog.component.scss'
})
export class EmailQuoteDialogComponent {

  email!: string;
  constructor(
    public dialogRef: MatDialogRef<EmailQuoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onClose(): void {
    this.dialogRef.close();
  }

  submitEmail() {
    if (this.email) {
      this.dialogRef.close();  // Close the dialog
    } else {
      alert('Please enter an email address.');
    }
  }
}
