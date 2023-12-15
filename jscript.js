// Script para la galería de imágenes de las hamburguesas
let indiceCuadradoActual = 0;
const cuadradosPorPagina = 3;

function cambiarCuadrado(direccion) {
    const cuadrados = document.querySelectorAll('.cuadrado');
    const numCuadrados = cuadrados.length;

    const cuadradosVisibles = Math.min(cuadradosPorPagina, numCuadrados);
    const limite = numCuadrados - cuadradosVisibles;

    indiceCuadradoActual += direccion;

    if (indiceCuadradoActual < 0) {
        indiceCuadradoActual = 0;
    } else if (indiceCuadradoActual > limite) {
        indiceCuadradoActual = limite;
    }

    const offset = -indiceCuadradoActual * cuadrados[0].offsetWidth;
    document.querySelector('.galeria-pedido').style.transform = `translateX(${offset}px)`;
}


