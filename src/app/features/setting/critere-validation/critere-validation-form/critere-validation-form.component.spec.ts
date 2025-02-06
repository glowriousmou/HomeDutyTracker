import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CritereValidationFormComponent } from './critere-validation-form.component';

describe('CritereValidationFormComponent', () => {
  let component: CritereValidationFormComponent;
  let fixture: ComponentFixture<CritereValidationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CritereValidationFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CritereValidationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
