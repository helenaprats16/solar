# Projecte Angular: Registre i Login

## Descripció
Aquest projecte és una aplicació Angular que implementa un sistema de registre i login.  
Inclou:

- Formulari de registre amb validacions (email, contrasenya mínima de 8 caràcters).  
- Formulari de login que connecta amb Supabase per autenticar l'usuari.  
- Gestió de dades de l'usuari dins del component després del login.  
- Connexió amb Supabase per obtenir dades de plantes (exemple de consulta GET).  

## Estructura principal
- `supaservice.ts`: Servei que gestiona la connexió amb Supabase i les peticions HTTP.  
- `login.component.ts`: Component standalone per al login amb formulari reactiu.  
- `environment.ts`: Conté `supabaseUrl` i `supabaseKey` per connectar amb Supabase.  
- `plantes/`: Exemple de model i servei per gestionar plantes.  

## Com executar el projecte
1. Instal·lar dependències:
   ```bash
   npm install
