import { Component, Input } from '@angular/core';
import { ToggleGroupFormField } from './dynamic-toggle-group-field';

@Component({
  selector: 'app-dynamic-toggle-group',
  template: `
    <div
      class="dynamic-control dynamic-toggle-group d-flex pb-4"
      [class]="field.classList"
      *transloco="let t"
    >
      <div
        class="d-flex flex-column align-items-center w-100"
        *ngIf="field.style === 'button-toggle'"
      >
        <label *ngIf="field.label" class="fw-bold mb-1 ms-2">
          {{ t(field.label) }}
        </label>

        <mat-button-toggle-group
          [id]="field.id"
          class="ms-2 w-100"
          #group="matButtonToggleGroup"
          [formControl]="field.control"
          [vertical]="field.vertical"
        >
          <mat-button-toggle
            *ngFor="let option of field.options"
            [value]="option.value"
            [disabled]="option.disabled"
            class="w-100"
          >
            {{ option.displayName }}
          </mat-button-toggle>
        </mat-button-toggle-group>
      </div>

      <div *ngIf="field.style === 'radio'">
        <label *ngIf="field.label" class="fw-bold mb-1 ms-2">
          {{ t(field.label) }}
        </label>

        <mat-radio-group
          [formControl]="field.control"
          [id]="field.id"
          color="primary"
          class="d-flex"
          [ngStyle]="{
            gap: field.vertical ? '4px' : '16px',
            'flex-direction': field.vertical ? 'column' : 'row'
          }"
        >
          <mat-radio-button
            *ngFor="let option of field.options"
            [value]="option.value"
            [disabled]="option.disabled"
          >
            {{ option.displayName }}
          </mat-radio-button>
        </mat-radio-group>
      </div>
    </div>
  `,
  styleUrls: []
})
export class DynamicToggleGroupComponent<T> {
  @Input() field!: ToggleGroupFormField<T>;

  @Input() key!: string;
}
