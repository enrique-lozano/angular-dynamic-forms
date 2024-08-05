import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicToggleComponent } from './dynamic-toggle.component';

describe('DynamicToggleComponent', () => {
  let component: DynamicToggleComponent;
  let fixture: ComponentFixture<DynamicToggleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicToggleComponent]
    });
    fixture = TestBed.createComponent(DynamicToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
