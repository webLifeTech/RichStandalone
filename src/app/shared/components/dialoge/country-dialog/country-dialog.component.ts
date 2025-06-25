import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-country-dialog',
  standalone: true,
  imports: [
    // CommonModule,
    // MatFormFieldModule,
    // MatDialogModule,
    // MatButtonModule,
    // MatInputModule,
    // MatIconModule,

    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatListModule,
    MatButtonModule,
    FormsModule
    // TranslateModule
  ],
  templateUrl: './country-dialog.component.html',
  styleUrls: ['./country-dialog.component.scss']
})
export class CountryDialogComponent {
  selectedCountry: any = {
    CountryName: 'INDIA'
  };
  searchText = '';

  countries: any = [
    // { name: 'India', code: 'IND', dialCode: '91' },
    // { name: 'Singapore', code: 'SGP', dialCode: '65' },
    // { name: 'Malaysia', code: 'MYS', dialCode: '60' },
    // { name: 'Indonesia', code: 'IDN', dialCode: '62' },
    // { name: 'Peru', code: 'PER', dialCode: '51' },
    // { name: 'Colombia', code: 'COL', dialCode: '57' },
    // { name: 'Viet Nam', code: 'VNM', dialCode: '84' },
    // { name: 'Cambodia', code: 'KHM', dialCode: '855' },
  ];

  constructor(
    private authService: AuthService,
    public dialogRef: MatDialogRef<CountryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log("data >>>>>>>>", data);
    this.selectedCountry = data.selectedCountry;
    this.countries = data.countries;
    // this.getCountryCodeList();
  }

  // getCountryCodeList(): void {
  //   this.authService.GetTwilioCountryCodeList().subscribe((res: any) => {
  //     this.countries = res;
  //   })
  // }

  close(): void {
    this.dialogRef.close(this.selectedCountry);
  }

  selectCountry(value: any) {
    this.selectedCountry = value;
    this.close();
  }

  get filteredCountries() {
    return this.countries.filter((c: any) =>
      c.CountryName.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
}
