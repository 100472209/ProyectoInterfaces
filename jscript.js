

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
        // Reemplazar el contenido del formulario con los botones de cerrar sesión y volver al inicio
        var formSection = document.getElementById("pagina2").querySelector(".formulario");
        formSection.innerHTML = `
            <button id = "cerrar_sesion" onclick="logoutUser()">Cerrar sesión</button>
            <button id = "borrar-cuenta" onclick="borrarCuenta()">Borrar cuenta</button>
        `;
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

function goToSeccion(sectionId, requiereSesion = false) {
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




