export interface Planta{
    id:number,
    created_at:number,
    nom:String,
    ubicacio:{latitude:number, longitude:number},//es un objecte
    capacitat: number,
    user:string,
    foto?:string //l'interrogant significa que es opcional
}