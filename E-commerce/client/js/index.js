const shopContent = document.getElementById('shopContent');
const cart = []; //El carrito es un array vacío


document.addEventListener("DOMContentLoaded", function () {
const contactoLink = document.querySelector('a[href="#contacto"]');
const contactoSection = document.getElementById("contacto");

contactoLink.addEventListener("click", function (e) {
e.preventDefault(); // Evita el scroll automático
contactoSection.classList.toggle("visible");
contactoSection.classList.toggle("oculto");
});
});

productos.forEach((product) => {
    const content = document.createElement('div');
    content.innerHTML = `
        <img src="${product.image}">
        <h3>${product.productName}</h3>
        <p>$ ${product.price}</p>
        <p>Stock: ${product.quantity}</p>
        <input class="quantity-selected" type="number" id="quantity-${product.id}" value=${1} min="1" max="${product.quantity}"/>
    `;
    shopContent.append(content);

    const buyButton = document.createElement("button");
    buyButton.innerText = "Comprar";

    // Agregamos el botón al contenido del producto
    content.appendChild(buyButton);

    buyButton.addEventListener("click", () => {
      // Agregamos un evento click al botón para agregar el producto al carrito
        const quantityInput = document.getElementById(`quantity-${product.id}`);
        const selectedQuantity = parseInt(quantityInput.value);

        // Validar que la cantidad no sea mayor al stock disponible
        if (selectedQuantity > product.quantity) {
            alert("No puedes comprar más de la cantidad disponible en stock");
            return;
        }
        // Revisamos si el producto ya existe en el carrito
        const existingProduct = cart.find((item) => item.id === product.id);

        if (existingProduct) {
            // Si ya existe, solo actualizamos la cantidad
            existingProduct.quantity += selectedQuantity;
            // Controlamos que la suma no exceda el stock
            if (existingProduct.quantity > product.quantity) {
            alert("No puedes agregar más productos de este tipo.");
            existingProduct.quantity = product.quantity; // Ajustamos al máximo permitido
            }
            displayCartCounter();
        } else {
            // Si no existe, lo agregamos al carrito con la cantidad seleccionada
            cart.push({
            id: product.id,
            productName: product.productName,
            price: product.price,
            quantity: selectedQuantity,
            image: product.image,
            });
            displayCartCounter();
        }

        // Reducir el stock adecuado al producto
        product.quantity -= selectedQuantity;

        // Actualizar el stock mostrado
        content.querySelector(
            "p:nth-child(4)"
        ).innerText = `Stock: ${product.quantity}`;

        console.log(cart);
    });
});