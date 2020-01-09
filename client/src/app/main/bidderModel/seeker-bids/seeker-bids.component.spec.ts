import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeekerBidsComponent } from './seeker-bids.component';

describe('SeekerPendingJobsComponent', () => {
  let component: SeekerBidsComponent;
  let fixture: ComponentFixture<SeekerBidsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeekerBidsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeekerBidsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
