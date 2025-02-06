import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgSelectModule } from '@ng-select/ng-select';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';

export interface State {
  name: string;
  logo: string;
  id: string;
}
export interface Location {
  name: string;
  logo: string;
}

export interface Category {
  category_name: string; // Attorney / Mortgage brokers / Insurance Agent / Vehicle Inspections
  logo: string;
  rating: string;
  review: string;
  location: string;
  sub_category: [];
  mobile_number: string;
  whatsapp_number: string;
  isTrusted: boolean;
  isVerified: boolean;
  preference: {
    icon: string,
    label: string // top search / trending / responsive
  };
}


@Component({
  selector: 'app-search-cat-loaction',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    NgSelectModule,

    MatFormFieldModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,

    CommonModule,
    FormsModule
  ],
  templateUrl: './search-cat-loaction.component.html',
  styleUrl: './search-cat-loaction.component.scss'
})
export class SearchCatLoactionComponent {
  // categories = [
  //   { id: 1, name: 'Restaurants' },
  //   { id: 2, name: 'Delivery' },
  //   { id: 3, name: 'Takeout' },
  //   { id: 4, name: 'Accountants' },
  //   { id: 5, name: 'Plumbers' },
  //   { id: 6, name: 'Auto Repair' },
  // ];

  selectedCategory: any = 'Attorney';
  location: string = '';

  @Input() categories: State[]
  @Output() onHandleSubmit = new EventEmitter<any>();

  stateCtrl = new FormControl('');
  locationCtrl = new FormControl('');
  filteredStates: Observable<State[]>;
  filteredLocation: Observable<Location[]>;

  // states: State[] = [];

  locations: Location[] = [
    {
      name: 'Your Location',
      logo: 'assets/images/cab/icon/location-pin.svg',
    },
  ];

  constructor() {
    this.filteredStates = this.stateCtrl.valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filterStates(state) : this.categories.slice())),
    );
    this.filteredLocation = this.locationCtrl.valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filterLocation(state) : this.locations.slice())),
    );
  }

  private _filterStates(value: any): State[] {
    const filterValue = value.toLowerCase();
    return this.categories.filter(state => state);
  }
  private _filterLocation(value: any): Location[] {
    const filterValue = value.toLowerCase();
    return this.locations.filter(i => i);
  }

  clearLocation() {
    this.location = '';
  }

  onSearch() {
    console.log('locationCtrl:', this.locationCtrl);
    console.log('Searching for:', this.selectedCategory, this.location);

    this.onHandleSubmit.emit({
      selectedCategory: this.selectedCategory,
      location: this.location
    })
  }
}
