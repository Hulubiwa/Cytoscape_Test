import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdgeDialog } from './edge-dialog';

describe('EdgeDialog', () => {
  let component: EdgeDialog;
  let fixture: ComponentFixture<EdgeDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EdgeDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdgeDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
