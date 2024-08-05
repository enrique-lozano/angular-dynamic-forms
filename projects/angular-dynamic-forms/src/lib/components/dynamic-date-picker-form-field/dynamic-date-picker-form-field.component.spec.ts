import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicDatePickerFormFieldComponent } from './dynamic-date-picker-form-field.component';

describe('DynamicDatePickerFormFieldComponent', () => {
  let component: DynamicDatePickerFormFieldComponent;
  let fixture: ComponentFixture<DynamicDatePickerFormFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicDatePickerFormFieldComponent]
    });
    fixture = TestBed.createComponent(DynamicDatePickerFormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
