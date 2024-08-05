import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicIconOrButtonIconComponent } from './dynamic-icon-or-button-icon.component';

describe('DynamicIconOrButtonIconComponent', () => {
  let component: DynamicIconOrButtonIconComponent;
  let fixture: ComponentFixture<DynamicIconOrButtonIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicIconOrButtonIconComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicIconOrButtonIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
