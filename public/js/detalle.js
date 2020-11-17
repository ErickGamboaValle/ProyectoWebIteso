const HTTTPMethods = {
    "put":"PUT",
    "post":"POST",
    "get":"GET",
    "delete":"DELETE"
}
const APIURL = window.location.protocol+'//'+window.location.host+'/api';
let TOKEN = getTokenValue('token');
let PAGES = {
    current : 1,
    currentIndex:0,
    list:[1,2,3],
    limit:5
};
function getTokenValue(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
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
function sendHTTPRequest(urlAPI,data,method,cbOK,cbError,){
    // 1. Crear XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    // 2. Configurar:  PUT actualizar archivo
    xhr.open(method, urlAPI);
    // 3. indicar tipo de datos JSON
    xhr.setRequestHeader('Content-Type', 'application/json');
    console.log(TOKEN);
    xhr.setRequestHeader('x-auth-user', TOKEN);
    // 4. Enviar solicitud al servidor
    xhr.send(data);
    // 5. Una vez recibida la respuesta del servidor
    xhr.onload = function () {
        if (xhr.status != 200) { // analizar el estatus de la respuesta HTTP 
            // Ocurrió un error
            alert(xhr.status + ': ' + xhr.statusText); // e.g. 404: Not Found
            cbError(xhr.status + ': ' + xhr.statusText);
        } else {
            // console.log(xhr.responseText); // Significa que fue exitoso
            cbOK({status:xhr.status, data:xhr.responseText});
        }
    };
}



const userToHTML=(user)=>{
    let sexo = (user.sexo ==='H')?'Hombre':'Mujer';
    return `
    <div class="media col-8 mt-2">
        <div class="media-left align-self-center mr-3">
            <img class="rounded-circle" src="${user.image}" >
        </div>
        <div class="media-body">
                <h4>${user.nombre} ${user.apellidos}</h4>
                <p >Correo: ${user.email}</p>
                <p >Fecha de nacimiento:${user.fecha} </p>
                <p >Sexo: ${sexo} </p>
            </div>
    </div>`
}
const userListToHTML=(list, id)=>{
    if(id && list && document.getElementById(id)){
        console.log(list);
        document.getElementById(id).innerHTML =  list.map(userToHTML).join(' ');
    }
}

function getUser() {
    let urlParams = new URLSearchParams(window.location.search);
    let email = urlParams.get('email');
    sendHTTPRequest(APIURL+`/users/${email}`, "getUser", HTTTPMethods.get, (us) => {
        console.log("HOLA"+us.data);
        let userData = JSON.parse(us.data);
        let user = [{
            "nombre": userData.nombre,
            "apellidos":  userData.apellidos,
            "email":  userData.email,
            "fecha": userData.fecha,
            "sexo": userData.sexo,
            "image": userData.image
        }]
        userListToHTML(user,'lista');
    }, (err) => {
        console.log("error" + err)
    });
}
document.addEventListener('DOMContentLoaded',()=>{
    getUser();
});