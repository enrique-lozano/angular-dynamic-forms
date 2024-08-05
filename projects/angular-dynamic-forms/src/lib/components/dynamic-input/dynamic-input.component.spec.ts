import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicInputComponent } from './dynamic-input.component';

describe('DynamicInputComponent', () => {
  let component: DynamicInputComponent;
  let fixture: ComponentFixture<DynamicInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicInputComponent]
    });
    fixture = TestBed.createComponent(DynamicInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
