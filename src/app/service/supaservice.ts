import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Planta } from '../plantes/planta';
import { environment } from '../../environments/environment';
import { createClient, SupabaseClient} from '@supabase/supabase-js';
@Injectable({
  providedIn: 'root',
})
export class Supaservice {
  private http = inject(HttpClient);
  private supabase: SupabaseClient;

  constructor(){
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  getEcho(data: string){
    return data;
  }

  getPlantes(): Observable<Planta[]>{
    return this.http.get<Planta[]>(environment.supabaseUrl +"/rest/v1/plantes?select=*",{
      headers: new HttpHeaders({
        apikey: environment.supabaseUrl,
        Authorization: `Bearer ${environment.supabaseKey}`
      })
    })
  }


  async login(loginData: {email: string, password: string}){
    let { data, error } = await this.supabase.auth.signInWithPassword(loginData);
    if(error){
      console.error("error insertinf data");
      throw error;
    }
    return data;
    
  }

}
