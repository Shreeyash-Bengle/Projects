import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllRecordsComponent } from './all-records.component';

describe('AllRecordsComponent', () => {
  let component: AllRecordsComponent;
  let fixture: ComponentFixture<AllRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllRecordsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
