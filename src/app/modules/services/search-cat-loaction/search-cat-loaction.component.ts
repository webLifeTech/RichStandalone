import { Component } from '@angular/core';
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
  flag: string;
  name: string;
  population: string;
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
  categories = [
    { id: 1, name: 'Restaurants' },
    { id: 2, name: 'Delivery' },
    { id: 3, name: 'Takeout' },
    { id: 4, name: 'Accountants' },
    { id: 5, name: 'Plumbers' },
    { id: 6, name: 'Auto Repair' },
  ];
  selectedCategory: any;
  location: string = '';

  stateCtrl = new FormControl('');
  filteredStates: Observable<State[]>;

  states: State[] = [
    {
      name: 'Arkansas',
      population: '2.978M',
      // https://commons.wikimedia.org/wiki/File:Flag_of_Arkansas.svg
      flag: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Arkansas.svg',
    },
    {
      name: 'California',
      population: '39.14M',
      // https://commons.wikimedia.org/wiki/File:Flag_of_California.svg
      flag: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_California.svg',
    },
    {
      name: 'Florida',
      population: '20.27M',
      // https://commons.wikimedia.org/wiki/File:Flag_of_Florida.svg
      flag: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Florida.svg',
    },
    {
      name: 'Texas',
      population: '27.47M',
      // https://commons.wikimedia.org/wiki/File:Flag_of_Texas.svg
      flag: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Texas.svg',
    },
  ];

  constructor() {
    this.filteredStates = this.stateCtrl.valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filterStates(state) : this.states.slice())),
    );
  }

  private _filterStates(value: any): State[] {
    const filterValue = value.toLowerCase();

    return this.states.filter(state => state.name.toLowerCase().includes(filterValue));
  }

  clearLocation() {
    this.location = '';
  }

  onSearch() {
    console.log('Searching for:', this.selectedCategory, this.location);
  }
}
