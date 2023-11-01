const user = JSON.parse(localStorage.getItem("usuario"));

//console.log(user);

if (user !== "Admin") {
  //caso de que el usuario no este en LS lo devuelve a la pagina principal
  window.location.href = "../login/index.html";
}

import { nuevoUsuario } from "../../../api.js";
import { mostrarAlerta, mostrarAlertaOk } from "./alerta.js";

const formulario = document.querySelector("#formulario");
formulario.addEventListener("submit", validarUsuario);

function validarUsuario(e) {
  e.preventDefault();
  const nombre = document.querySelector("#nombre").value;

  const categoria = document.querySelector("#categoria").value;

  const usuario = {
    nombre,
    categoria,
  };

  console.log(usuario);
  if (validacion(usuario)) {
    mostrarAlerta("Todos los campos son obligatios");
    return;
  } else {
    nuevoUsuario(usuario);
    window.location.href = "lista_usuarios.html";
  }
}

function validacion(obj) {
  return !Object.values(obj).every((i) => i !== "");
}
