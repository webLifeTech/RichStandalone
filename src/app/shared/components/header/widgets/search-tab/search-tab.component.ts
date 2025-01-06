import { Component, EventEmitter, Output } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'app-search-tab',
  standalone: true,
  imports: [
    AngularSvgIconModule
  ],
  templateUrl: './search-tab.component.html',
  styleUrls: ['./search-tab.component.scss']
})
export class SearchTabComponent {

  @Output() searchBox = new EventEmitter<string>();

  public activeTab: string = 'hotel';
  public searchBoxType: string = '';

  ngOnInit() {
    if (this.activeTab == 'hotel') {
      this.searchBoxType = 'basic'
    } else if (this.activeTab == 'holiday') {
      this.searchBoxType = 'holiday'
    } else if (this.activeTab == 'flight') {
      this.searchBoxType = 'flight-two'
    } else if (this.activeTab == 'cab') {
      this.searchBoxType = 'cab-two'
    } else if (this.activeTab == 'food') {
      this.searchBoxType = 'food'
    }

    this.searchBox.emit(this.searchBoxType)

  }

  tabbed(value: string) {
    this.activeTab = value

    if (value == 'hotel') {
      this.searchBoxType = 'basic'
    } else if (value == 'holiday') {
      this.searchBoxType = 'holiday'
    } else if (value == 'flight') {
      this.searchBoxType = 'flight-two'
    } else if (value == 'cab') {
      this.searchBoxType = 'cab-two'
    } else if (value == 'food') {
      this.searchBoxType = 'food'
    }

    this.searchBox.emit(this.searchBoxType)

  }
}
