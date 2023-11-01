export function mostrarAlerta(mensaje) {
  const alerta = document.querySelector(".bg-red-100");

  if (!alerta) {
    const alert = document.createElement("p");
    alert.classList.add(
      "bg-red-100",
      "border-red-400",
      "text-red-700",
      "px-4",
      "py-3",
      "rounded",
      "text-center"
    );
    alert.innerHTML = `
    <strong>Error</strong>
    <span>${mensaje}</span>
    
    `;
    formulario.appendChild(alert);

    setTimeout(() => {
      alert.remove();
    }, 3000);
  }
}

export function mostrarAlertaOk(mensaje) {
  const alerta = document.querySelector(".bg-red-100");

  if (!alerta) {
    const alert = document.createElement("p");
    alert.classList.add(
      "bg-green-100",
      "border-red-400",
      "text-green-700",
      "px-4",
      "py-3",
      "rounded",
      "text-center"
    );
    alert.innerHTML = `
    <strong>OK</strong>
    <span>${mensaje}</span>
    
    `;
    formulario.appendChild(alert);

    setTimeout(() => {
      alert.remove();
    }, 3000);
  }
}
