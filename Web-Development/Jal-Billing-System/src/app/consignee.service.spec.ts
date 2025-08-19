import { TestBed } from '@angular/core/testing';

import { ConsigneeService } from './consignee.service';

describe('ConsigneeService', () => {
  let service: ConsigneeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsigneeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
