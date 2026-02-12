
// Servicio para gestionar la conexión y operaciones con Supabase y la API REST
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Planta } from '../plantes/planta'; // Modelo de planta
import { environment } from '../../environments/environment'; // Configuración de entorno
import { createClient, Session, SupabaseClient } from '@supabase/supabase-js'; // Cliente de Supabase

@Injectable({
  providedIn: 'root', // Hace que el servicio sea singleton en toda la app
})
export class Supaservice {
  // Inyección de HttpClient para peticiones HTTP
  private http = inject(HttpClient);
  // Cliente de Supabase para autenticación y otras operaciones
  private supabase: SupabaseClient;
  private sessionSubject = new BehaviorSubject<Session | null>(null);
  session$ = this.sessionSubject.asObservable();

  constructor(){
    // Inicializa el cliente de Supabase con las claves del entorno
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

    // Carrega la sessio inicial i escolta canvis
    this.supabase.auth.getSession().then(({ data }) => {
      this.sessionSubject.next(data.session ?? null);
    });
    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.sessionSubject.next(session ?? null);
    });
  }

  // Método de ejemplo que simplemente devuelve el dato recibido
  getEcho(data: string){
    return data;
  }

  // Obtiene la lista de plantas desde la API REST de Supabase
  getPlantes(): Observable<Planta[]>{
    return this.http.get<Planta[]>(environment.supabaseUrl +"/rest/v1/plantes?select=*",{
      headers: new HttpHeaders({
        apikey: environment.supabaseUrl, // (¡Revisar! Normalmente aquí va la key, no la url)
        Authorization: `Bearer ${environment.supabaseKey}`
      })
    })
  }

  // Realiza login usando el sistema de autenticación de Supabase
  async login(loginData: {email: string, password: string}){
    let { data, error } = await this.supabase.auth.signInWithPassword({
      email: loginData.email,
      password: loginData.password
    })
    if(error){
      console.error("error insertinf data");
      throw error;
    }
    return data;
  }

  // Registra un nou usuari en Supabase
  async registre(registreData: {email: string, password: string}) {
    // Fa la crida a Supabase per registrar l'usuari
    let { data, error } = await this.supabase.auth.signUp({
      email: registreData.email,
      password: registreData.password

    });
    if(error){
      // Si hi ha error, el llancem perquè el component el puga gestionar
      throw error;
    }
    return data;
  }

  // Comprova si hi ha sessio activa
  async getSession() {
    const { data, error } = await this.supabase.auth.getSession();
    if (error) {
      console.error('error obtenint la sessio');
      return null;
    }
    return data.session;
  }

  // Tanca la sessio actual
  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      console.error('error tancant la sessio');
      throw error;
    }
    this.sessionSubject.next(null);
  }
}
