# Solar - Gestió de Plantes Renovables

Projecte Angular per a la gestió i visualització de plantes d’energia renovable (solar/eòlica). Permet llistar, consultar detalls i gestionar usuaris amb autenticació Supabase.


## Rutes de l’Aplicació
- `/home`: Pàgina principal
- `/plantes`: Llista de plantes
- `/plantes_table`: Taula de plantes
- `/planta/:id`: Detall d’una planta
- `/login`: Login d’usuari
- `/registre`: Registre d’usuari
- `**`: Redirecció a home si la ruta no existeix

## Execució del Projecte
1. Instal·la dependències:
   ```bash
   npm install
   ```
2. Executar en mode desenvolupament:
   ```bash
   npm start
   # o
   ng serve -o
   ```
3. Accedir a `http://localhost:4200`

