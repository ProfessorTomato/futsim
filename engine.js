/**
 * Número aleatorio con decimales entre min y max.
 *
 * @param {number} min - min number
 * @param {number} max - max number
 * @return {number} a random floating point number
 */
function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Número entero aleatorio entre min y max.
 *
 * @param {number} min - min number
 * @param {number} max - max number
 * @return {number} a random integer
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Valor booleano aleatorio.
 *
 * @return {boolean} a random true/false
 */
function getRandomBool() {
  return Math.random() >= 0.5;
}

/**
  Función que simula un partido en función de los valores de ataque, defensa,
  mediocampo e intensidad de los equipos local y visitante recogidos en los
  sliders.
*/
function simular ( ata_l, def_l, med_l, int_l, ata_v, def_v, med_v, int_v ) {

  /* La posesión decide qué equipo es más probable que genere ocasiones.
  Si hay una ocasión, y un equipo tiene el 70% de posesión, tendrá un
  70% de probabilidades de que esa ocasión sea suya.
  El mediocampo tiene un 90% del peso de la posesión, mientras que la
  intensidad tiene un 10%. */

  /* Hay un factor aleatorio en la posesión. Los valores de cada equipo pueden
  estar un 5% más arriba o más abajo */
  var posesion_l = (med_l*0.9 + int_l*0.1) * getRandomFloat(0.95,1.05);
  var posesion_v = (med_v*0.9 + int_v*0.1) * getRandomFloat(0.95,1.05);

  var posesion_total_l = posesion_l / (posesion_l + posesion_v) * 100;
  posesion_total_l = Math.round (posesion_total_l * 10) / 10;
  var posesion_total_v = 100 - posesion_total_l;
  posesion_total_v = Math.round (posesion_total_v * 10) / 10;

  var resultado = [posesion_total_l, posesion_total_v];

  // Simulación minuto a minuto
  for (var i = 1; i <= 90; i++) {
    // 15% de probabilidades de que haya una ocasión en un minuto del partido
    if (Math.random() <= 0.15) {
      // Hay una ocasión
      if (Math.random() <= (posesion_total_l/100)) {
        // Ocasión local
        if ((Math.random() <= (ata_l/100)) && (Math.random() >= (def_v/100))) {
          resultado.push(3);
        } else {
          resultado.push(1);
        }
      } else {
        // Ocasión visitante
        if ((Math.random() <= (ata_v/100)) && (Math.random() >= (def_l/100))) {
          resultado.push(4);
        } else {
          resultado.push(2);
        }
      }
    } else {
      //No hay ocasión
      resultado.push(0);
    }
  }

  /* resultado es un array de 92 elementos: los dos primeros son la posesión
  del equipo local y el visitante, y los 90 siguientes corresponden a los 90
  minutos de partido, indicando 0 = no hay ocasión, 1 = ocasión local (no gol),
  2 = ocasión visitante (no gol), 3 = gol local, 4 = gol visitante */
  return resultado;

}

/**
  Función que analiza los datos de la simulación (array) y obtiene estadísticas.
*/

function analizar ( resultado ) {

  /* La variable de resultado analizado contendrá:
     - [0] -> Goles local
     - [1] -> Goles visitante
     - [2] -> Ocasiones local (goles + fallos)
     - [3] -> Ocasiones visitante (goles + fallos)
     - [4] -> Efectividad local (goles / ocasiones totales)
     - [5] -> Efectividad visitante (goles / ocasiones totales)
     - [6] -> Posesión local
     - [7] -> Posesión visitante
  */
  var res_analizado = [];

  var gol_l = 0;
  var gol_v = 0;
  var oca_l = 0;
  var oca_v = 0;
  var efe_l = 0;
  var efe_v = 0;
  var pos_l = resultado[0];
  var pos_v = resultado[1];

  for (var i = 2; i <= 91; i++) {
    if (resultado[i] != 0) {
      if (resultado[i] == 1) {
        // Ocasión local
        oca_l++;
      } else if (resultado[i] == 2) {
        // Ocasión visitante
        oca_v++;
      } else if (resultado[i] == 3) {
        // Gol local
        gol_l++;
        oca_l++;
      } else if (resultado[i] == 4) {
        // Gol visitante
        gol_v++;
        oca_v++;
      }
    }
  }

  if (oca_l > 0)
    efe_l = gol_l / oca_l * 100;
  else
    efe_l = 0;

  if (oca_v > 0)
    efe_v = gol_v / oca_v * 100;
  else
    efe_v = 0;

  // Ahora se ajustan para que se muestren con un decimal
  efe_l = Math.round (efe_l * 10) / 10;
  efe_v = Math.round (efe_v * 10) / 10;

  res_analizado.push(gol_l);
  res_analizado.push(gol_v);
  res_analizado.push(oca_l);
  res_analizado.push(oca_v);
  res_analizado.push(efe_l);
  res_analizado.push(efe_v);
  res_analizado.push(pos_l);
  res_analizado.push(pos_v);

  return res_analizado;
}
