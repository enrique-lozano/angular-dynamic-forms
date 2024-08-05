import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AngularMaterialModule } from 'src/app/core/modules/angular-material.module';
import { ComponentsModule } from 'src/app/core/modules/components.module';
import { DirectivesModule } from 'src/app/core/modules/directives.module';
import { DynamicButton } from 'src/app/shared/models/dynamic-button.model';

@Component({
  selector: 'app-dynamic-button',
  standalone: true,
  imports: [
    CommonModule,
    DirectivesModule,
    ComponentsModule,
    AngularMaterialModule
  ],
  template: `
    <ng-container *ngIf="button && button.isVisibleWithFullPrivileges">
      <ng-container *hasPrivilege="button.privileges">
        <button
          *ngIf="button.type === null"
          mat-button
          [color]="button.materialColor"
          [ngClass]="button.ngClass"
          [disabled]="button.isDisabled"
          (click)="button.onClicked && button.onClicked()"
        >
          <app-loading-button-label
            [icon]="button.icon"
            [label]="button.label"
            [isLoading]="button.isLoading"
            [iconPosition]="button.iconPosition"
          ></app-loading-button-label>
        </button>

        <button
          *ngIf="button.type === 'flat'"
          mat-flat-button
          [color]="button.materialColor"
          [ngClass]="button.ngClass"
          [disabled]="button.isDisabled"
          (click)="button.onClicked && button.onClicked()"
        >
          <app-loading-button-label
            [icon]="button.icon"
            [label]="button.label"
            [isLoading]="button.isLoading"
            [iconPosition]="button.iconPosition"
          ></app-loading-button-label>
        </button>

        <button
          *ngIf="button.type === 'stroked'"
          mat-stroked-button
          [color]="button.materialColor"
          [ngClass]="button.ngClass"
          [disabled]="button.isDisabled"
          (click)="button.onClicked && button.onClicked()"
        >
          <app-loading-button-label
            [icon]="button.icon"
            [label]="button.label"
            [isLoading]="button.isLoading"
            [iconPosition]="button.iconPosition"
          ></app-loading-button-label>
        </button>

        <button
          *ngIf="button.type === 'raised'"
          mat-raised-button
          [color]="button.materialColor"
          [ngClass]="button.ngClass"
          [disabled]="button.isDisabled"
          (click)="button.onClicked && button.onClicked()"
        >
          <app-loading-button-label
            [icon]="button.icon"
            [label]="button.label"
            [isLoading]="button.isLoading"
            [iconPosition]="button.iconPosition"
          ></app-loading-button-label>
        </button>
      </ng-container>
    </ng-container>
  `,
  styleUrls: ['./dynamic-button.component.scss']
})
export class DynamicButtonComponent {
  @Input() button!: DynamicButton;
}
