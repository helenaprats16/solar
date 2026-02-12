// Importem el necessari per a formularis reactius

import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Supaservice } from '../../service/supaservice';


  // Afegim ReactiveFormsModule als imports per a poder usar formularis reactius en la vista

  @Component({
    selector: 'app-registre',
    imports: [ReactiveFormsModule],
    templateUrl: './registre.html',
    styleUrl: './registre.css',
    standalone: true,
  })
  export class Registre {
    supaservice: Supaservice = inject(Supaservice);
    formulario: FormGroup;
    formBuilder: FormBuilder = inject(FormBuilder);
    registreResult: any = null; // Variable para guardar el resultado del registro

    constructor() {
      this.formulario = this.formBuilder.group({
        email: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'),
          ],
        ],
        password: ['', [Validators.required, Validators.minLength(8)]],
        passwordrepeat: ['', [Validators.required, Validators.minLength(8)]],
      });
    }

    async registrar() {
      if (this.formulario.invalid) {
        // Marca todos los campos como tocados para que se muestren los errores
        Object.values(this.formulario.controls).forEach(control => control.markAsTouched());
        return;
      }
      const registreData = this.formulario.value;
      this.supaservice.registre(registreData).then((data) => {
          console.log(data);
          this.registreResult = data;
        })
        .catch((error) => {
          // Aquí puedes gestionar el error, por exemple mostrar un missatge
          console.error(error);
        });
    }
  }

