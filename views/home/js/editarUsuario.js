import { editarUsuario, obternerUsuario } from "../../../api.js";
import { mostrarAlerta, mostrarAlertaOk } from "./alerta.js";
//import { validacion } from "./nuevoProducto.js";

const nombreInput = document.querySelector("#nombre");
const categoriaInput = document.querySelector("#categoria");
const inputId = document.querySelector("#id"); // esta hidden en el html

// hacer el registro de la validacion
const formulario = document.querySelector("#formulario");
formulario.addEventListener("submit", validarUsuarios);

document.addEventListener("DOMContentLoaded", async () => {
  //consultar en la url para extraer y guardar el id que enviamos en la ruta
  const parametroURL = new URLSearchParams(window.location.search); //URLSearchParams se utiliza para extraer los parametros de la url, se puede usar para sesiones y enviar el usuario para hacer validaciones de sesiones
  //console.log(window.location.search);

  const idUsuario = parseInt(parametroURL.get("id"));

  //console.log(idUsuario);

  const usuario = await obternerUsuario(idUsuario);
  //console.log(usuario);

  mostrarUsuario(usuario);
});

function mostrarUsuario(usuario) {
  // mostrar los datos del producto en la interfz editar

  const { nombre, categoria, id } = usuario;

  nombreInput.value = nombre;
  categoriaInput.value = categoria;
  inputId.value = id;
}

async function validarUsuarios(e) {
  e.preventDefault();
  const usuario = {
    nombre: nombreInput.value,
    categoria: categoriaInput.value,
    id: parseInt(inputId.value),
  };

  if (validacion(usuario)) {
    mostrarAlerta("Todos los campos son obligatorios");
    return;
  } else {
    await editarUsuario(usuario);
    window.location.href = "lista_usuarios.html";
    mostrarAlertaOk("Usuario Actualizado!");
  }
}

function validacion(obj) {
  return !Object.values(obj).every((i) => i !== "");
}
