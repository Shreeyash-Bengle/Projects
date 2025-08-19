import { TestBed } from '@angular/core/testing';

import { DefStockService } from './def-stock.service';

describe('DefStockService', () => {
  let service: DefStockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DefStockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
