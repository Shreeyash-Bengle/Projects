import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefStockComponent } from './def-stock.component';

describe('DefStockComponent', () => {
  let component: DefStockComponent;
  let fixture: ComponentFixture<DefStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefStockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
