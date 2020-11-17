const HTTTPMethods = {
    "put": "PUT",
    "post": "POST",
    "get": "GET",
    "delete": "DELETE"
}
const APIURL = window.location.protocol + '//' + window.location.host + '/api';
let TOKEN = getTokenValue('token');


function getTokenValue(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function sendHTTPRequest(urlAPI, data, method, cbOK, cbError, authToken) {
    // 1. Crear XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    // 2. Configurar:  PUT actualizar archivo
    xhr.open(method, urlAPI);
    // 3. indicar tipo de datos JSON
    xhr.setRequestHeader('Content-Type', 'application/json');
    if (authToken)
        xhr.setRequestHeader('x-auth-user', authToken);
    // 4. Enviar solicitud al servidor
    xhr.send(data);
    // 5. Una vez recibida la respuesta del servidor
    xhr.onload = function () {
        if (xhr.status != 200 && xhr.status != 201) { // analizar el estatus de la respuesta HTTP 
            // Ocurrió un error
            cbError(xhr.status + ': ' + xhr.statusText);
        } else {
            console.log(xhr.responseText); // Significa que fue exitoso
            cbOK({
                status: xhr.status,
                data: xhr.responseText
            });
        }
    };
}

function login(user) {
    console.log('login...');
    //agrega tu codigo...
    sendHTTPRequest(APIURL + "/login", user, HTTTPMethods.post, function (dataUser) {
        // data contiene el status y el token que se parsea a objeto.
        if (dataUser) {
            setCookie('token', JSON.parse(dataUser.data).token, 2);
            window.location.href = "/consulta.html";
        }

    }, (error) => {
        console.log(error); ///devuelve string error
    }, TOKEN);

}

function createUser(valforms) {
    console.log('createUser');
    //agrega tu codigo...

    let newUser = {
        nombre: valforms[0],
        apellidos: valforms[1],
        email: valforms[2],
        password: valforms[3],
        fecha: valforms[5],
        sexo: valforms[6],
        image: valforms[7].length != 0 ? valforms[7] : undefined
    }
    console.log(JSON.stringify(newUser));

    sendHTTPRequest(APIURL + "/users", JSON.stringify(newUser), HTTTPMethods.post, (userAdd) => {
        console.log("Usuario agregado" + userAdd)
        document.getElementById('responseMSG').innerHTML = '<div class="alert alert-success" role="alert">Usuario Agregado</div>';
    }, (err) => {
        document.getElementById('responseMSG').innerHTML = '<div class="alert alert-danger" role="alert">Este usuario ya existe!</div>';
    }, TOKEN);
}

/*
cerrarB(){

};
*/

document.addEventListener('DOMContentLoaded', () => {
    //agrega tu codigo de asignación de eventos...

    //boton de login.....
    let loginBtn = document.getElementById('loginBtn');
    loginBtn.addEventListener('click', function () {
        let email = document.getElementById('userInputLogin').value;
        let password = document.getElementById('passwordInputLogin').value;
        let objLogin = JSON.stringify({
            email: email,
            password: password
        });
        login(objLogin);
    });

    //registro de usuario y boton guardar
    $('#createFormModal').on('show.bs.modal', function (event) {
        //agrega tu codigo...
        console.log(event);
        let form = document.getElementById('createFormModal');
        let SaveUserBtn = document.getElementById('createUserBtn');
        let listForm;
        let valForm = []; //cambiable
        form.addEventListener('change', function () {
            if (!form.querySelector('input:invalid') && document.getElementById('password1').value == document.getElementById('password2').value) {
                listForm = form.querySelectorAll('input').values();
                let valuesForm = [];
                for (const i of listForm) {
                    if (!(i.type == 'radio' && !i.checked))
                        valuesForm.push(i.value);
                }
                valForm = valuesForm; //cambiable
                SaveUserBtn.disabled = false;
                SaveUserBtn.onclick = () => {
                    createUser(valForm);
                };
            } else {
                SaveUserBtn.disabled = true;
            }
            listInputs = form.querySelector('input:invalid');
            console.log(listInputs);
        });
    });
});