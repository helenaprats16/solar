import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Supaservice } from '../../service/supaservice';
import { JsonPipe, NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgClass, JsonPipe, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone:true,
})
export class Login {

  supaservice: Supaservice = inject(Supaservice);
  router: Router = inject(Router);
  formulario: FormGroup;
  formBuilder: FormBuilder = inject(FormBuilder);
  loguedData: any;
  submitted = false;

  constructor(){
    this.formulario = this.formBuilder.group({
      email:['' ,[Validators.email, Validators.required,Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })
  }

  login(){
    this.submitted = true;
    if (this.formulario.invalid) {
      // Marquem tots els camps per a mostrar errors
      Object.values(this.formulario.controls).forEach(control => control.markAsTouched());
      return;
    }
    const loginData = this.formulario.value;
    this.supaservice.login(loginData).then(data => {
    console.log(data)
    this.loguedData = data;
    // Despres de fer login, tornem a home
    this.router.navigate(['/home']);
    }).catch((error) => {
      console.error(error);
    });
  }

  get emailNotValid(){
    return this.formulario.controls['email']!.invalid &&
            this.formulario.controls['email']!.touched;
  }

  get emailValid(){
    return this.formulario.get('email')!.valid &&
            this.formulario.get('email')!.touched;
  }


  get emailValidation(){
    if(this.formulario.get('email')!.invalid && this.formulario.get('email')!.touched){
      return 'is-invalid';
    }

    if (this.formulario.get('email')!.valid && this.formulario.get('email')!.touched){
      return 'is-valid';
    }
    return '';
  }
}
