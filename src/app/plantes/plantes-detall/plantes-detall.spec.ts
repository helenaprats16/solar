import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantesDetall } from './plantes-detall';

describe('PlantesDetall', () => {
  let component: PlantesDetall;
  let fixture: ComponentFixture<PlantesDetall>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantesDetall]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantesDetall);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
