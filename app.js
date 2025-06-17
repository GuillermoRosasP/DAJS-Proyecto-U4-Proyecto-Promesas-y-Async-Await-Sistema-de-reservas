// script.js

const TOTAL_MESAS = 5;
let reservas = [];

function obtenerMesasReservadas(fecha, hora) {
  const reservasHorario = reservas.filter(r => r.fecha === fecha && r.hora === hora);
  return reservasHorario.reduce((total, r) => total + r.mesas, 0);
}

function verificarDisponibilidad(fecha, hora, mesasSolicitadas) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const ocupadas = obtenerMesasReservadas(fecha, hora);
      const disponibles = TOTAL_MESAS - ocupadas;
      if (mesasSolicitadas <= disponibles) {
        resolve();
      } else {
        reject(`Solo quedan ${disponibles} mesas disponibles.`);
      }
    }, 500);
  });
}

function enviarConfirmacion(nombre, correo) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.9) {
        const folio = generarFolio();
        resolve(folio);
      } else {
        reject("Error al enviar el correo.");
      }
    }, 500);
  });
}

function validarCorreo(correo) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(correo);
}

async function realizarReserva() {
  const nombre = document.getElementById('nombre').value.trim();
  const correo = document.getElementById('correo').value.trim();
  const fecha = document.getElementById('fecha').value;
  const hora = document.getElementById('hora').value;
  const mesas = parseInt(document.getElementById('mesas').value);

  if (!nombre || !correo || !fecha || !hora || mesas <= 0) {
    mostrarMensaje("Por favor completa todos los campos.");
    return;
  }

  if (!validarCorreo(correo)) {
    mostrarMensaje("Correo electrónico inválido.");
    return;
  }

  try {
    await verificarDisponibilidad(fecha, hora, mesas);
    reservas.push({ nombre, correo, fecha, hora, mesas });
    const folio = await enviarConfirmacion(nombre, correo);
    mostrarModal(`Reserva confirmada.<br>Folio: <strong>${folio}</strong> enviado al correo.`);
    mostrarReservas();
  } catch (error) {
    mostrarMensaje("Error: " + error);
  }
}

function cancelarReserva() {
  const correo = document.getElementById('correoCancelacion').value.trim();
  const fecha = document.getElementById('fechaCancelacion').value;
  const hora = document.getElementById('horaCancelacion').value;

  if (!correo || !fecha || !hora) {
    mostrarMensaje("Completa todos los datos de cancelación.");
    return;
  }

  if (!validarCorreo(correo)) {
    mostrarMensaje("Correo electrónico inválido.");
    return;
  }

  const index = reservas.findIndex(r => r.correo === correo && r.fecha === fecha && r.hora === hora);
  if (index !== -1) {
    reservas.splice(index, 1);
    const folio = generarFolio();
    mostrarModal(`Reserva cancelada.<br>Folio de cancelación: <strong>${folio}</strong> enviado al correo.`);
    mostrarReservas();
  } else {
    mostrarMensaje("No se encontró la reserva para cancelar.");
  }
}

function mostrarMensaje(mensaje) {
  document.getElementById('resultado').innerText = mensaje;
}

function mostrarReservas() {
  const panel = document.getElementById('listaReservas');
  if (reservas.length === 0) {
    panel.innerHTML = "<p>No hay reservas activas.</p>";
    return;
  }

  let html = "<ul>";
  reservas.forEach(r => {
    html += `<li><strong>${r.nombre}</strong> (${r.correo}) - ${r.fecha} ${r.hora} | ${r.mesas} mesas</li>`;
  });
  html += "</ul>";
  panel.innerHTML = html;
}

// Mostrar ventana modal
function mostrarModal(mensaje) {
  document.getElementById('mensajeModal').innerHTML = mensaje;
  document.getElementById('modal').style.display = "block";
}

function cerrarModal() {
  document.getElementById('modal').style.display = "none";
}

// Generar un código de folio aleatorio
function generarFolio() {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
}
