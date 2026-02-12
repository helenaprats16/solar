// Importem el necessari per a formularis reactius

import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators, ReactiveFormsModule } from '@angular/forms';
import { Supaservice } from '../../service/supaservice';
import { Router, RouterLink } from '@angular/router';


  // Afegim ReactiveFormsModule als imports per a poder usar formularis reactius en la vista

  @Component({
    selector: 'app-registre',
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './registre.html',
    styleUrl: './registre.css',
    standalone: true,
  })
  export class Registre {
    supaservice: Supaservice = inject(Supaservice);
    router: Router = inject(Router);
    formulario: FormGroup;
    formBuilder: FormBuilder = inject(FormBuilder);
    registreResult: any = null; // Variable para guardar el resultado del registro
    submitted = false;

    constructor() {
      this.formulario = this.formBuilder.group(
        {
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
        },
        { validators: this.passwordMatchValidator }
      );
    }

    private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
      const password = control.get('password')?.value;
      const repeat = control.get('passwordrepeat')?.value;

      if (!password || !repeat) {
        return null;
      }

      return password === repeat ? null : { passwordMismatch: true };
    }

    async registrar() {
      this.submitted = true;
      if (this.formulario.invalid) {
        // Marca todos los campos como tocados para que se muestren los errores
        Object.values(this.formulario.controls).forEach(control => control.markAsTouched());
        return;
      }
      const registreData = this.formulario.value;
      this.supaservice.registre(registreData).then((data) => {
          console.log(data);
          this.registreResult = data;
          window.alert('Usuari creat correctament. Revisa el correu si cal confirmar.');
          // Despres de registrar, tornem a home
          this.router.navigate(['/login']);
        })
        .catch((error) => {
          // Aquí puedes gestionar el error, por exemple mostrar un missatge
          console.error(error);
          if (error?.message === 'User already registered') {
            window.alert("Aquest correu ja esta registrat. Prova d'iniciar sessio.");
            return;
          }
          window.alert('No s\'ha pogut crear el compte. Torna-ho a provar.');
        });
    }
  }

