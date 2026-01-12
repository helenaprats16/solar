import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantesItem } from './plantes-item';

describe('PlantesItem', () => {
  let component: PlantesItem;
  let fixture: ComponentFixture<PlantesItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantesItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantesItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
