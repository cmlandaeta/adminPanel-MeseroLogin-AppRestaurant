import { editarProducto, obternerProducto } from "../../../api.js";
import { mostrarAlerta, mostrarAlertaOk } from "./alerta.js";
//import { validacion } from "./nuevoProducto.js";

const nombreInput = document.querySelector("#nombre");
const categoriaInput = document.querySelector("#categoria");
const precioInput = document.querySelector("#precio");
const inputId = document.querySelector("#id"); // esta hidden en el html

// hacer el registro de la validacion
const formulario = document.querySelector("#formulario");
formulario.addEventListener("submit", validarProducto);

document.addEventListener("DOMContentLoaded", async () => {
  //consultar en la url para extraer y guardar el id que enviamos en la ruta
  const parametroURL = new URLSearchParams(window.location.search); //URLSearchParams se utiliza para extraer los parametros de la url, se puede usar para sesiones y enviar el usuario para hacer validaciones de sesiones
  //console.log(window.location.search);

  const idProducto = parseInt(parametroURL.get("id"));

  //console.log(idProducto)

  const producto = await obternerProducto(idProducto);
  //console.log(producto);

  mostrarUsuarios(producto);
});

function mostrarUsuarios(producto) {
  // mostrar los datos del producto en la interfz editar

  const { nombre, precio, categoria, id } = producto;

  nombreInput.value = nombre;
  precioInput.value = precio;
  categoriaInput.value = categoria;
  inputId.value = id;
}

async function validarProducto(e) {
  e.preventDefault();
  const producto = {
    nombre: nombreInput.value,
    precio: precioInput.value,
    categoria: categoriaInput.value,
    id: parseInt(inputId.value),
  };

  if (validacion(producto)) {
    mostrarAlerta("Todos los campos son obligatorios");
    return;
  } else {
    await editarProducto(producto);
    window.location.href = "index.html";
    mostrarAlertaOk("Producto Actualizado!");
  }
}

function validacion(obj) {
  return !Object.values(obj).every((i) => i !== "");
}
