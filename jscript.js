document.addEventListener("DOMContentLoaded", function() {
    // Agregar el evento click a todos los enlaces que afectan a las secciones
    document.querySelectorAll('nav ul li a, div.fotos a, a.pide, div.user a, form.formulario a').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            var sectionId = this.getAttribute('href').slice(1);

            // Ocultar todas las secciones
            document.querySelectorAll('.section').forEach(function(section) {
                section.style.display = 'none';
            });

            // Mostrar la sección correspondiente
            var targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.style.display = 'flex';
            }
        });
    });
});


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


