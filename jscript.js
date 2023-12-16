document.addEventListener("DOMContentLoaded", function() {
    // Agregar el evento click a todos los enlaces que afectan a las secciones
    document.querySelectorAll('nav ul li a, div.fotos a, a.pide, div.user a, form.formulario a, div.boton-pideya a, div.confirmar-reserva a, div.boton-siguiente a, div.botones-pedido.bot-ped1 a, div.botones-pedido2.bot-ped2 a, div.boton-seguimiento a').forEach(function(link) {
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
    document.getElementById("crearcuenta").addEventListener("click", registerUser);
    document.getElementById("acceder").addEventListener("click", loginUser);
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

    // Guardar los datos del usuario en una cookie (esto no es seguro para aplicaciones reales)
    setCookie("username", nombre, 7);
    setCookie("email", email, 7);
    setCookie("password", password, 7);

    alert("Usuario registrado con éxito");
}

function loginUser() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    if (email === getCookie("email") && password === getCookie("password")) {
        // Cambiar el texto del encabezado a nombre de usuario
        document.querySelectorAll('.encabezado .user a').forEach(function(element) {
            element.textContent = getCookie("username");
        });
        // Reemplazar el contenido del formulario con los botones de cerrar sesión y volver al inicio
        var formSection = document.getElementById("pagina2").querySelector(".formulario");
        formSection.innerHTML = `
            <button id = "cerrar_sesion" onclick="logoutUser()">Cerrar sesión</button>
        `;
    } else {
        alert("Credenciales incorrectas.");
    }
}
document.getElementById("cerrar_sesion").onclick = logoutUser();


function logoutUser() {
    eraseCookie("username");
    eraseCookie("email");
    eraseCookie("password");

    // Restaurar el texto del encabezado a 'Inicia Sesión'
    document.querySelectorAll('.encabezado .user a').forEach(function(element) {
        element.textContent = "Inicia Sesión";
    });

    // Restaurar el contenido original de la sección de inicio de sesión
    // Restaurar el contenido original del formulario
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

function goToSeccion(sectionId) {
    document.querySelectorAll('.section').forEach(function(section) {
        section.style.display = 'none';
    });

    var targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'flex';
    }
}




