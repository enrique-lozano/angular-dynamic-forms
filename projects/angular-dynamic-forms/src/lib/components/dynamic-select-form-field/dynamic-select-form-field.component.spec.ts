import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicSelectFormFieldComponent } from './dynamic-select-form-field.component';

describe('DynamicSelectFormFieldComponent', () => {
  let component: DynamicSelectFormFieldComponent;
  let fixture: ComponentFixture<DynamicSelectFormFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicSelectFormFieldComponent]
    });
    fixture = TestBed.createComponent(DynamicSelectFormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
