import { TestBed } from '@angular/core/testing';

import { EInvoiceService } from './e-invoice.service';

describe('EInvoiceService', () => {
  let service: EInvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EInvoiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
