// Variables globales
const carrito = document.getElementById('carrito');
const listaCarrito = document.getElementById('lista-carrito').getElementsByTagName('tbody')[0];
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
const agregarCarritoBtns = document.querySelectorAll('.agregar-carrito');

// Arreglo que guardará los productos del carrito
let carritoItems = [];

// Función para agregar producto al carrito
function agregarAlCarrito(e) {
  const producto = e.target.closest('.product');
  const id = producto.querySelector('.agregar-carrito').getAttribute('data-id');
  const nombre = producto.querySelector('h3').textContent;
  const precio = producto.querySelector('.precio').textContent.replace('$', '').trim();
  const imagen = producto.querySelector('img').src;

  const productoExistente = carritoItems.find(item => item.id === id);

  if (productoExistente) {
    productoExistente.cantidad++;
  } else {
    carritoItems.push({
      id,
      nombre,
      precio,
      imagen,
      cantidad: 1
    });
  }

  // Actualizamos el carrito
  actualizarCarrito();
}

// Función para eliminar un producto del carrito
function eliminarProducto(e) {
  if (e.target.classList.contains('eliminar')) {
    const productoId = e.target.getAttribute('data-id');
    carritoItems = carritoItems.filter(item => item.id !== productoId);
    actualizarCarrito();
  }
}

// Función para vaciar el carrito
function vaciarCarrito() {
  carritoItems = [];
  actualizarCarrito();
}

// Función para actualizar el carrito en el DOM
function actualizarCarrito() {
  // Limpiar la lista del carrito
  listaCarrito.innerHTML = '';

  if (carritoItems.length === 0) {
    carrito.classList.remove('active');
    return;
  }

  // Agregar cada producto al carrito
  carritoItems.forEach(item => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td><img src="${item.imagen}" alt="${item.nombre}" style="width: 50px;"></td>
      <td>${item.nombre}</td>
      <td>$${item.precio}</td>
      <td>
        <button class="eliminar btn-2" data-id="${item.id}">Eliminar</button>
      </td>
    `;
    listaCarrito.appendChild(fila);
  });

  // Mostrar el carrito si tiene productos
  carrito.classList.add('active');
}

// Añadir los eventos a los botones de agregar al carrito
agregarCarritoBtns.forEach(btn => {
  btn.addEventListener('click', agregarAlCarrito);
});

// Evento para vaciar el carrito
vaciarCarritoBtn.addEventListener('click', vaciarCarrito);

// Evento para eliminar un producto del carrito
listaCarrito.addEventListener('click', eliminarProducto);

// Mostrar u ocultar el carrito al hacer clic en el icono del carrito
document.getElementById('img-carrito').addEventListener('click', () => {
  carrito.classList.toggle('active');
});

// Reemplaza con tu clave pública de Stripe
const stripe = Stripe("TU_CLAVE_PUBLICA_DE_STRIPE");

// Crear elementos para el formulario de pago
const elements = stripe.elements();
const card = elements.create("card");
card.mount("#card-element");

// Manejar el evento de envío del formulario
document.querySelector("#payment-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  // Simula la clave secreta desde el backend (esto sería dinámico en producción)
  const clientSecret = "TU_CLIENT_SECRET_DESDE_BACKEND";

  const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: card,
    },
  });

  const result = document.getElementById("payment-result");
  if (error) {
    // Mostrar mensaje de error
    result.textContent = "Pago fallido: " + error.message;
    result.style.color = "red";
    result.style.display = "block";
  } else if (paymentIntent.status === "succeeded") {
    // Confirmar el pago exitoso
    result.textContent = "¡Pago realizado con éxito!";
    result.style.color = "green";
    result.style.display = "block";
  }
});






document.addEventListener("DOMContentLoaded", () => {
  // Reemplaza con tu clave pública de Stripe
  const stripe = Stripe("TU_CLAVE_PUBLICA_STRIPE");
  
  // Crea una instancia de Elements
  const elements = stripe.elements();
  
  // Crea el elemento de la tarjeta
  const cardElement = elements.create("card", {
    style: {
      base: {
        fontSize: "16px",
        color: "#32325d",
        fontFamily: "Arial, sans-serif",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
      },
    },
  });

  // Monta el elemento de la tarjeta en el contenedor correspondiente
  cardElement.mount("#card-element");

  // Manejar el evento de envío del formulario
  const paymentForm = document.getElementById("payment-form");
  paymentForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Confirma el pago utilizando el elemento de la tarjeta
    const { error, paymentIntent } = await stripe.confirmCardPayment("TU_CLIENT_SECRET", {
      payment_method: {
        card: cardElement,
      },
    });

    // Manejo de errores o confirmación exitosa
    const paymentResult = document.getElementById("payment-result");
    if (error) {
      paymentResult.textContent = "Error: " + error.message;
      paymentResult.style.display = "block";
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      paymentResult.textContent = "¡Pago realizado con éxito!";
      paymentResult.style.display = "block";
      console.log("Detalles del pago:", paymentIntent);
    }
  });
});




paypal.Buttons({
  createOrder: function (data, actions) {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: document.querySelector("#total-amount").value, // Total del carrito
          },
        },
      ],
    });
  },
  onApprove: function (data, actions) {
    return actions.order.capture().then(function (details) {
      alert("¡Pago realizado por " + details.payer.name.given_name + "!");
      console.log("Productos comprados:", carrito);
    });
  },
}).render("#payment-form");
