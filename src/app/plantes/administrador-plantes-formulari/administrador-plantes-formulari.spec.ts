import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministradorPlantesFormulari } from './administrador-plantes-formulari';

describe('AdministradorPlantesFormulari', () => {
  let component: AdministradorPlantesFormulari;
  let fixture: ComponentFixture<AdministradorPlantesFormulari>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministradorPlantesFormulari]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministradorPlantesFormulari);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
