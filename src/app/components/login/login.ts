import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Supaservice } from '../../service/supaservice';
import { JsonPipe, NgClass } from '@angular/common';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgClass,JsonPipe],
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone:true,
})
export class Login {

  supaservice: Supaservice = inject(Supaservice);
  formulario: FormGroup;
  formBuilder: FormBuilder = inject(FormBuilder);
  loguedData: any;

  constructor(){
    this.formulario = this.formBuilder.group({
      email:['' ,[Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })
  }

  login(){
    const loginData = this.formulario.value;
    this.supaservice.login(loginData).then(data => {
    console.log(data)
    this.loguedData = data; });
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
