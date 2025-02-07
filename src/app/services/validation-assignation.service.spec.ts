import { TestBed } from '@angular/core/testing';

import { ValidationAssignationService } from './validation-assignation.service';

describe('ValidationAssignationService', () => {
  let service: ValidationAssignationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidationAssignationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
