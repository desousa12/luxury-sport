import type { Product, TeamCategory } from "../types/menu";

export const teamCategories: TeamCategory[] = [
  { id: "all", name: "Todos" },
  { id: "barcelona", name: "Barcelona" },
  { id: "real-madrid", name: "Real Madrid" },
  { id: "bayern-munich", name: "Bayern Munich" },
  { id: "espana", name: "España" },
  { id: "psg", name: "Paris Saint Germain" },
  { id: "inter-miami", name: "Inter Miami" },
  { id: "chelsea", name: "Chelsea" },
];

const tallas = ["S", "M", "L", "XL"];

export const products: Product[] = [
  { id: "barcelona-raphinha-alt", nombre: "Raphinha - Barcelona - alternativa", equipo: "Barcelona", categoria: "barcelona", precio: 20, imagen: "/images/catalogo/LuxurySport.Bqto/Fc Barcelona_/Alternativa_/raphinha alt.jpg", tallas },
  { id: "barcelona-gordon-local", nombre: "Gordon - Barcelona - local", equipo: "Barcelona", categoria: "barcelona", precio: 20, imagen: "/images/catalogo/LuxurySport.Bqto/Fc Barcelona_/Local/Gordon local.jpg", tallas },
  { id: "barcelona-adeyemi-local", nombre: "Adeyemi - Barcelona - local", equipo: "Barcelona", categoria: "barcelona", precio: 20, imagen: "/images/catalogo/LuxurySport.Bqto/Fc Barcelona_/Local/adeyemi local.jpg", tallas },
  { id: "barcelona-local", nombre: "Barcelona", equipo: "Barcelona", categoria: "barcelona", precio: 20, imagen: "/images/catalogo/LuxurySport.Bqto/Fc Barcelona_/Local/barcelona local.jpg", tallas },
  { id: "barcelona-lamine-local", nombre: "Lamine Yamal - Barcelona - local", equipo: "Barcelona", categoria: "barcelona", precio: 20, imagen: "/images/catalogo/LuxurySport.Bqto/Fc Barcelona_/Local/lamine yamal local.jpg", tallas },
  { id: "barcelona-pedri-local", nombre: "Pedri - Barcelona - local", equipo: "Barcelona", categoria: "barcelona", precio: 20, imagen: "/images/catalogo/LuxurySport.Bqto/Fc Barcelona_/Local/pedri local.jpg", tallas },
  { id: "barcelona-raphinha-local", nombre: "Raphinha - Barcelona - local", equipo: "Barcelona", categoria: "barcelona", precio: 20, imagen: "/images/catalogo/LuxurySport.Bqto/Fc Barcelona_/Local/raphinha local.jpg", tallas },
  { id: "barcelona-rodri-local", nombre: "Rodri - Barcelona - local", equipo: "Barcelona", categoria: "barcelona", precio: 20, imagen: "/images/catalogo/LuxurySport.Bqto/Fc Barcelona_/Local/rodri local.jpg", tallas },
  { id: "barcelona-adeyemi-away", nombre: "Adeyemi - Barcelona - visitante", equipo: "Barcelona", categoria: "barcelona", precio: 20, imagen: "/images/catalogo/LuxurySport.Bqto/Fc Barcelona_/Visitante/adeyemi away.jpg", tallas },
  { id: "barcelona-gordon-away", nombre: "Gordon - Barcelona - visitante", equipo: "Barcelona", categoria: "barcelona", precio: 20, imagen: "/images/catalogo/LuxurySport.Bqto/Fc Barcelona_/Visitante/gordon away.jpg", tallas },
  { id: "barcelona-lamine-away", nombre: "Lamine Yamal - Barcelona - visitante", equipo: "Barcelona", categoria: "barcelona", precio: 20, imagen: "/images/catalogo/LuxurySport.Bqto/Fc Barcelona_/Visitante/lamine yamal away.jpg", tallas },
  { id: "barcelona-pedri-away", nombre: "Pedri - Barcelona - visitante", equipo: "Barcelona", categoria: "barcelona", precio: 20, imagen: "/images/catalogo/LuxurySport.Bqto/Fc Barcelona_/Visitante/pedri away.jpg", tallas },
  { id: "barcelona-raphinha-away", nombre: "Raphinha - Barcelona - visitante", equipo: "Barcelona", categoria: "barcelona", precio: 20, imagen: "/images/catalogo/LuxurySport.Bqto/Fc Barcelona_/Visitante/raphinha away.jpg", tallas },
  { id: "barcelona-rodri-away", nombre: "Rodri - Barcelona - visitante", equipo: "Barcelona", categoria: "barcelona", precio: 20, imagen: "/images/catalogo/LuxurySport.Bqto/Fc Barcelona_/Visitante/rodri away.jpg", tallas },

  { id: "madrid-bellingham-alt", nombre: "Bellingham - Real Madrid - alternativa", equipo: "Real Madrid", categoria: "real-madrid", precio: 20, imagen: "/images/catalogo/LuxurySport.Bqto/Real Madrid_/Alternativa/bellingham alt.jpg", tallas },
  { id: "madrid-mbappe-alt", nombre: "Mbappe - Real Madrid - alternativa", equipo: "Real Madrid", categoria: "real-madrid", precio: 20, imagen: "/images/catalogo/LuxurySport.Bqto/Real Madrid_/Alternativa/mbappe alt.jpg", tallas },
  { id: "madrid-valverde-alt", nombre: "Valverde - Real Madrid - alternativa", equipo: "Real Madrid", categoria: "real-madrid", precio: 20, imagen: "/images/catalogo/LuxurySport.Bqto/Real Madrid_/Alternativa/valverde alt.jpg", tallas },
  { id: "madrid-vinicius-alt", nombre: "Vinicius Jr - Real Madrid - alternativa", equipo: "Real Madrid", categoria: "real-madrid", precio: 20, imagen: "/images/catalogo/LuxurySport.Bqto/Real Madrid_/Alternativa/vinicius jr alt.jpg", tallas },
  { id: "madrid-local-2025", nombre: "Real Madrid - local", equipo: "Real Madrid", categoria: "real-madrid", precio: 20, imagen: "/images/catalogo/LuxurySport.Bqto/Real Madrid_/Local_/20260807_120954.jpg", tallas },
  { id: "madrid-arda-local", nombre: "Arda Guler - Real Madrid - local", equipo: "Real Madrid", categoria: "real-madrid", precio: 20, imagen: "/images/catalogo/LuxurySport.Bqto/Real Madrid_/Local_/arda guler.jpg", tallas },
  { id: "madrid-bellingham-local", nombre: "Bellingham - Real Madrid - local", equipo: "Real Madrid", categoria: "real-madrid", precio: 20, imagen: "/images/catalogo/LuxurySport.Bqto/Real Madrid_/Local_/bellingham.jpg", tallas },
  { id: "madrid-cucurella-local", nombre: "Cucurella - Real Madrid - local", equipo: "Real Madrid", categoria: "real-madrid", precio: 20, imagen: "/images/catalogo/LuxurySport.Bqto/Real Madrid_/Local_/cucurella.jpg", tallas },
  { id: "madrid-local", nombre: "Real Madrid", equipo: "Real Madrid", categoria: "real-madrid", precio: 20, imagen: "/images/catalogo/LuxurySport.Bqto/Real Madrid_/Local_/real madrid.jpg", tallas },
  { id: "madrid-manga-larga-local", nombre: "Real Madrid - Manga larga - local", equipo: "Real Madrid", categoria: "real-madrid", precio: 20, imagen: "/images/catalogo/LuxurySport.Bqto/Real Madrid_/Local_/real madrid manga larga.jpg", tallas },
  { id: "madrid-valverde-local", nombre: "Valverde - Real Madrid - local", equipo: "Real Madrid", categoria: "real-madrid", precio: 20, imagen: "/images/catalogo/LuxurySport.Bqto/Real Madrid_/Local_/valverde.jpg", tallas },
  { id: "madrid-vinicius-local", nombre: "Vinicius Jr - Real Madrid - local", equipo: "Real Madrid", categoria: "real-madrid", precio: 20, imagen: "/images/catalogo/LuxurySport.Bqto/Real Madrid_/Local_/vinicius jr.jpg", tallas },
  { id: "madrid-bellingham-away", nombre: "Bellingham - Real Madrid - visitante", equipo: "Real Madrid", categoria: "real-madrid", precio: 20, imagen: "/images/catalogo/LuxurySport.Bqto/Real Madrid_/Visitante_/bellingham away.jpg", tallas },
  { id: "madrid-cucurella-away", nombre: "Cucurella - Real Madrid - visitante", equipo: "Real Madrid", categoria: "real-madrid", precio: 20, imagen: "/images/catalogo/LuxurySport.Bqto/Real Madrid_/Visitante_/cucurella away.jpg", tallas },
  { id: "madrid-mbappe-away", nombre: "Mbappe - Real Madrid - visitante", equipo: "Real Madrid", categoria: "real-madrid", precio: 20, imagen: "/images/catalogo/LuxurySport.Bqto/Real Madrid_/Visitante_/mbappe away.jpg", tallas },
  { id: "madrid-away", nombre: "Real Madrid - visitante", equipo: "Real Madrid", categoria: "real-madrid", precio: 20, imagen: "/images/catalogo/LuxurySport.Bqto/Real Madrid_/Visitante_/real madrid away.jpg", tallas },
  { id: "madrid-vinicius-away", nombre: "Vinicius Jr - Real Madrid - visitante", equipo: "Real Madrid", categoria: "real-madrid", precio: 20, imagen: "/images/catalogo/LuxurySport.Bqto/Real Madrid_/Visitante_/vinicius jr away.jpg", tallas },

  { id: "bayern-kane", nombre: "Kane - Bayern Munich - local", equipo: "Bayern Munich", categoria: "bayern-munich", precio: 20, imagen: "/images/catalogo/LuxurySport.Bqto/Bayern Munich/kane.jpg", tallas },
  { id: "bayern-luis-diaz", nombre: "Luis Diaz - Bayern Munich - local", equipo: "Bayern Munich", categoria: "bayern-munich", precio: 20, imagen: "/images/catalogo/LuxurySport.Bqto/Bayern Munich/luis diaz.jpg", tallas },
  { id: "bayern-olise", nombre: "Olise - Bayern Munich - local", equipo: "Bayern Munich", categoria: "bayern-munich", precio: 20, imagen: "/images/catalogo/LuxurySport.Bqto/Bayern Munich/olise.jpg", tallas },

  { id: "espana-lamine-away", nombre: "Lamine Yamal - España - visitante", equipo: "España", categoria: "espana", precio: 20, imagen: "/images/catalogo/LuxurySport.Bqto/españa/lamine yamal away.jpg", tallas },
  { id: "espana-pedri-away", nombre: "Pedri - España - visitante", equipo: "España", categoria: "espana", precio: 20, imagen: "/images/catalogo/LuxurySport.Bqto/españa/pedri away.jpg", tallas },
  { id: "espana-pedri-local", nombre: "Pedri - España - local", equipo: "España", categoria: "espana", precio: 20, imagen: "/images/catalogo/LuxurySport.Bqto/españa/pedri.jpg", tallas },

  { id: "chelsea", nombre: "Chelsea", equipo: "Chelsea", categoria: "chelsea", precio: 20, imagen: "/images/catalogo/LuxurySport.Bqto/Equipos Varios_/chelsea.jpg", tallas },
  { id: "inter-miami-messi", nombre: "Messi - Inter Miami - local", equipo: "Inter Miami", categoria: "inter-miami", precio: 20, imagen: "/images/catalogo/LuxurySport.Bqto/Equipos Varios_/inter de miami-messi.jpg", tallas },
  { id: "psg-ferran", nombre: "Ferran - Paris Saint Germain - local", equipo: "Paris Saint Germain", categoria: "psg", precio: 20, imagen: "/images/catalogo/LuxurySport.Bqto/Equipos Varios_/psg-ferran.jpg", tallas },
  { id: "psg-kvaratskhelia", nombre: "Kvaratskhelia - Paris Saint Germain - local", equipo: "Paris Saint Germain", categoria: "psg", precio: 20, imagen: "/images/catalogo/LuxurySport.Bqto/Equipos Varios_/psg-kvaratskhelia.jpg", tallas },
];
