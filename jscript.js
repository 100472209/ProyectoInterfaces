document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.boton-horas').forEach(function(boton) {
        boton.addEventListener('click', function() {
            // Verificar si este botón ya está seleccionado
            if (boton.classList.contains('seleccionado')) {
                // Si ya está seleccionado, simplemente quitar la selección
                boton.classList.remove('seleccionado');
            } else {
                // Comprobar si ya hay algún botón seleccionado
                const seleccionado = document.querySelector('.boton-horas.seleccionado');
                if (seleccionado) {
                    // Si ya hay un botón seleccionado, mostrar una alerta y no permitir una nueva selección
                    alert('No puedes seleccionar más de una hora. Por favor, deselecciona la hora actual para elegir una diferente.');
                } else {
                    // Si no hay otro botón seleccionado, permitir la selección de este botón
                    boton.classList.add('seleccionado');
                }
            }
        });
    });
    var botonMenu = document.querySelector('.menu-icon');
    var menuMovil = document.querySelector('.mobile-menu');

    botonMenu.addEventListener('click', function() {
        // Alternar la visibilidad del menú cada vez que se hace clic en el botón
        if (menuMovil.style.display === 'flex') {
            menuMovil.style.display = 'none';
        } else {
            menuMovil.style.display = 'flex';
            menuMovil.style.flexDirection = 'column';
        }
    });
});




var Boton = document.getElementById('boton-conf');
Boton.addEventListener('click', confirmarReserva);
Boton.addEventListener('click', function (){goToSeccion('pagina7', false);});

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

// Función para establecer una cookie
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

// Función para obtener una cookie
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

// Función para eliminar una cookie
function eraseCookie(name) {
    document.cookie = name+'=; Max-Age=-99999999;';
}
function registerUser() {
    var nombre = document.getElementById("nombre").value;
    var email = document.getElementById("correo").value;
    var password = document.getElementById("contraseña").value;

    var users = JSON.parse(getCookie("users") || "[]");

    // Comprobar si el usuario ya existe
    var userExists = users.some(function(user) { return user.email === email; });
    if (userExists) {
        alert("Este correo electrónico ya está registrado.");
        return;
    }

    users.push({ nombre: nombre, email: email, password: password });

    setCookie("users", JSON.stringify(users), 7);
}

function loginUser() {

    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    var users = JSON.parse(getCookie("users") || "[]");

    var user = users.find(function(u) { return u.email === email && u.password === password; });

    if (user) {
        // Usuario encontrado y contraseña correcta
        setCookie("currentUser", user.email, 7);
        document.querySelector('.user a').textContent = user.nombre;
        // Cambiar el texto del encabezado a nombre de usuario
        document.querySelectorAll('.encabezado .user a').forEach(function(element) {
            element.textContent = user.nombre;
        });
        // Reemplazar el contenido del formulario con los botones de cerrar sesión volver al inicio y las reservas

        var formSection = document.getElementById("pagina2").querySelector(".formulario");
        formSection.innerHTML = `
            <button id = "cerrar_sesion" onclick="logoutUser()">Cerrar sesión</button>
            <button id = "borrar-cuenta" onclick="borrarCuenta()">Borrar cuenta</button>
        `;
        crearLabelReservas(user.email);
    } else {
        alert("Credenciales incorrectas.");
    }
}

function logoutUser() {

    eraseCookie("currentUser");

    // Restaurar el texto del encabezado a 'Inicia Sesión'
    document.querySelectorAll('.encabezado .user a').forEach(function(element) {
        element.textContent = "Inicia Sesión";
    });

    // Restaurar el contenido original de la sección de inicio de sesión
    // Restaurar el contenido original del formulario
    var reservasLabel = document.getElementById("reservas-usuario");
    if (reservasLabel) {
        reservasLabel.parentNode.removeChild(reservasLabel);
    }
    var reservasDiv = document.getElementById("tus-reservas");
    reservasDiv.style.display = "none";

    var formSection = document.getElementById("pagina2").querySelector(".formulario");
    formSection.innerHTML = `
        <h2>Accede a tu cuenta</h2>
        <input type="email" id="email" placeholder="CORREO ELECTRÓNICO" required><br>
        <input type="password" id="password" placeholder="CONTRASEÑA" required><br>
        <button type="button" id="acceder" onclick="loginUser()">ACCEDER</button><br>
        <div><a href="javascript:void(0);" onclick="goToSeccion('pagina3')" >¿Aún no somos bitfriends?</a></div>
        <div><a href="javascript:void(0);" onclick="goToSeccion('pagina3')">REGÍSTRATE</a></div>
    `;

}
document.getElementById("crearcuenta").onclick = registerUser;
document.getElementById("acceder").onclick = loginUser;

function goToSeccion(sectionId, requiereSesion) {
    if (requiereSesion && !haySesionIniciada()) {
        alert("Debes iniciar sesión para acceder a esta sección.");
        return;
    }

    document.querySelectorAll('.section').forEach(function(section) {
        section.style.display = 'none';
    });

    var targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'flex';
    }
}

function borrarCuenta() {
    var currentUserEmail = getCookie("currentUser");
    if (!currentUserEmail) {
        alert("No hay ninguna sesión iniciada.");
        return;
    }

    var users = JSON.parse(getCookie("users") || "[]");

    // Filtrar para eliminar el usuario actual
    users = users.filter(function(user) { return user.email !== currentUserEmail; });

    // Actualizar la cookie con el nuevo array de usuarios
    setCookie("users", JSON.stringify(users), 7);
    eraseCookie("currentUser");

    // Cerrar sesión después de borrar la cuenta
    logoutUser();
}

function haySesionIniciada() {
    return getCookie("currentUser") !== null;  // Asumiendo que "currentUser" es la cookie de sesión
}

// Código para el carrito de la página web
const hamburguesas = [
    "BIT CRUNCHER",
    "HACKER PICANTE",
    "CAMARELIZED CODE BURGUER",
    "BINARY BACON BLISS BURGUER",
    "EGGCELENT CODE BURGUER",
    "PIXELATED PEPPER BURGUER",
    "RYBYTE OVERLOAD BURGUER"
]
// Diccionario con los datos de las hamburguesas
let carrito = {
    "BIT CRUNCHER": [0, 12.95],
    "HACKER PICANTE": [0, 11.95],
    "CAMARELIZED CODE BURGUER": [0, 9.95],
    "BINARY BACON BLISS BURGUER": [0, 12.95],
    "EGGCELENT CODE BURGUER": [0, 11.95],
    "PIXELATED PEPPER BURGUER": [0, 13.95],
    "RYBYTE OVERLOAD BURGUER": [0, 14.95]
}

botonesMas = document.querySelectorAll(".plus")
botonesMenos = document.querySelectorAll(".minus")
contadorCantidad = document.querySelectorAll(".count")

// Cambiamos el valor de los contadores para que muestren el de las cookies
contadorCantidad.forEach((el, index) => {
    let hamburguesa = hamburguesas[index];
    el.textContent = carrito[hamburguesa][0];
})

botonesMas.forEach((button, index) => {
    let hamburguesa = hamburguesas[index];
    button.addEventListener("click", () => {
        // Le sumamos al contador 1 
        contadorCantidad[index].textContent = ++carrito[hamburguesa][0];
        total_productos();
    });
});

botonesMenos.forEach((button, index) => {
    let hamburguesa = hamburguesas[index];
    button.addEventListener("click", () => {
        // Si el contador es mayor que cero le restamos 1 
        if (carrito[hamburguesa][0] > 0){
            contadorCantidad[index].textContent = --carrito[hamburguesa][0];
        } 
        total_productos();
    });
});

function total_productos() {
    let texto_hamb = "";
    let hamb_etiq = document.getElementById("productos-elegidos");
    let texto_total = document.getElementById("total-pago");
    let total = 0;
    hamburguesas.forEach((hamburguesa) => {
        total += carrito[hamburguesa][1] * carrito[hamburguesa][0];
        if (carrito[hamburguesa][0] > 0) {
            texto_hamb += carrito[hamburguesa][0] + " X "+ hamburguesa + "\n"; 
        }
    });
    console.log(total);
    texto_total.textContent = total.toFixed(2) + "€";
    hamb_etiq.innerHTML = texto_hamb.replace(/\n/g, "<br>");
}

function crearLabelReservas(emailUsuario) {
    var reservas = JSON.parse(getCookie("reservas") || "[]");
    var reservasUsuario = reservas.filter(function(reserva) { return reserva.usuario === emailUsuario; });

    var reservasDiv = document.getElementById("tus-reservas");
    var textoReservas = reservasDiv.querySelector(".texto-reservas");

    if (reservasUsuario.length === 0) {
        textoReservas.innerHTML = "Todavía no has hecho reservas";
    } else {
        var reservasHTML = "Tus reservas:<br>";
        reservasUsuario.forEach(function(reserva, index) {
            reservasHTML += `${reserva.hora} en ${reserva.restaurante} 
            <button onclick="borrarReserva(${index}, '${emailUsuario}')">Borrar</button><br>`;
        });
        textoReservas.innerHTML = reservasHTML;
    }

    reservasDiv.style.display = "flex"; // Mostrar el div
}


function borrarReserva(indiceReserva, emailUsuario) {
    var reservas = JSON.parse(getCookie("reservas") || "[]");
    var reservasUsuario = reservas.filter(function(reserva) { return reserva.usuario === emailUsuario; });

    if (indiceReserva < reservasUsuario.length) {
        // Eliminar la reserva del array
        var reservaAEliminar = reservasUsuario[indiceReserva];
        reservas = reservas.filter(function(reserva) {
            return !(reserva.usuario === reservaAEliminar.usuario && reserva.fecha === reservaAEliminar.fecha && reserva.hora === reservaAEliminar.hora);
        });

        // Actualizar las cookies
        setCookie("reservas", JSON.stringify(reservas), 7);

        // Actualizar el label de reservas
        crearLabelReservas(emailUsuario);
    }
}

function confirmarReserva() {
    var botonSeleccionado = document.querySelector('.boton-horas.seleccionado');
    if (botonSeleccionado) {
        var horaReserva = botonSeleccionado.textContent;
        var idRestaurante = botonSeleccionado.id;
        var usuario = getCookie("currentUser");

        var reservas = JSON.parse(getCookie("reservas") || "[]");
        reservas.push({ usuario: usuario, restaurante: idRestaurante, hora: horaReserva });
        setCookie("reservas", JSON.stringify(reservas), 7);
        crearLabelReservas(usuario);
        // Lógica para ir a la pantalla de confirmación o mostrar mensaje
    } else {
        alert("Por favor, selecciona una hora para tu reserva.");
    }
}


// Script para seguimiento 
document.addEventListener('DOMContentLoaded', function () {
    const fotos = document.querySelectorAll('.foto-container');
  
    function iniciarCuentaAtras(cuentaAtras, tiempo) {
      cuentaAtras.innerText = tiempo;
  
      let tiempoRestante = tiempo;
      const interval = setInterval(() => {
        tiempoRestante--;
        cuentaAtras.innerText = tiempoRestante;
  
        if (tiempoRestante <= 0) {
          clearInterval(interval);
          cuentaAtras.innerText = '';
        }
      }, 1000);
    }
  
    function mostrarSiguienteFoto(index) {
      if (index < fotos.length) {
        const cuentaAtras = fotos[index].querySelector('.cuenta-atras');
  
        //  Verifica si la página está visible antes de iniciar la cuenta atrás
        if (!document.hidden) {
          fotos[index].style.display = 'block';
          iniciarCuentaAtras(cuentaAtras, 10);
  
          setTimeout(() => {
            fotos[index].style.display = 'none';
            mostrarSiguienteFoto(index + 1);
          }, 10000);
        }
      }
    }
  
    // Inicio del proceso
    mostrarSiguienteFoto(0);
  });
  