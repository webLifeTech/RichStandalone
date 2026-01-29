import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GlobalService } from '../../../services/global.service';
import { MatIconModule } from '@angular/material/icon';
import { ProgressBarMode, MatProgressBarModule } from '@angular/material/progress-bar';
import { Observable, Subscribable } from 'rxjs';

export type StepStatus = 'Completed' | 'Active' | 'Pending' | 'Partially Completed';

export interface ProgressStep {
  id: string;
  title: string;
  module: string;
  route: string;
  status: 'active' | 'pending' | 'completed';
  section: number;
  completedSections: number[];
  progress: number;
}

@Component({
  selector: 'app-step-progress',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatProgressBarModule
  ],
  templateUrl: './step-progress.component.html',
  styleUrls: ['./step-progress.component.scss'],
})
export class StepProgressComponent {
  @Input() clickable = true;
  @Output() changeStep = new EventEmitter<any>();

  mode: ProgressBarMode = 'determinate';
  value = 50;
  bufferValue = 75;
  totalSections: any = 0;

  progressCompleted: any = 0;
  progressPending: any = 0;

  newSteps: any = {
    "progressBars": [],
  }

  constructor(
    private router: Router,
    public gs: GlobalService
  ) { }


  ngOnInit() {
    this.getTableData();
    // if (this.gs.loggedInUserInfo.role === "admin") {
    //   this.gs.isProgressStepShow = false;
    // }
  }

  getTableData() {
    const body = {
      "userId": this.gs.loggedInUserInfo.userId,
    }
    this.gs.GetUserProgressBarDetails(body).subscribe(async (response: any) => {
      if (response.response && response.response.statusCode == "200") {
        this.newSteps = response;
        this.totalSections = (100 / this.newSteps.progressBars.length);
        this.newSteps.progressBars = this.applyActiveStatus(this.newSteps.progressBars);
        this.gs.progressSteps = this.newSteps.progressBars;
      }
    }, (error: any) => {
      this.gs.isSpinnerShow = false;
    })
  }

  applyActiveStatus(steps: any[]): any[] {
    let makeNextActive = false;

    return steps.map((step, index) => {
      let status: StepStatus = step.status;
      if (!step.subBars) {
        if (step.status === 'Completed') {
          this.progressCompleted = (this.progressCompleted + this.totalSections);
        }
      }
      if (step.subBars) {
        if (step.status === 'Completed') {
          this.progressCompleted = (this.progressCompleted + this.totalSections);
        } else {
          for (let i in step.subBars) {
            if (step.subBars[i].isCompleted) {
              const temp = this.totalSections / step.subBars.length
              this.progressCompleted = this.progressCompleted + temp;
            }
          }
        }
      }
      if (status === 'Completed') {
        makeNextActive = true;
        return { ...step };
      }
      if (status === 'Partially Completed') {
        makeNextActive = false;
        return { ...step };
      }
      // First Pending after Completed → Active
      if (status === 'Pending' && makeNextActive) {
        makeNextActive = false;
        return { ...step, status: 'Active' };
      }
      return { ...step };
    });
  }

  navigate(step: ProgressStep) {
    if (!this.clickable || !step.route) return;
    this.router.navigate([step.route]);

  }
}
