import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CritereValidationComponent } from './critere-validation.component';

describe('CritereValidationComponent', () => {
  let component: CritereValidationComponent;
  let fixture: ComponentFixture<CritereValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CritereValidationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CritereValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
