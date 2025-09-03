let currentTotalPrice = 0;

const modalContainer = document.getElementById("modal-container");
const modalOverlay = document.getElementById("modal-overlay");
const cartBtn = document.getElementById("cart-btn");
const cartCounter = document.getElementById("cart-counter");
console.log(cartBtn)

const mercadopago = new MercadoPago("APP_USR-cbd72d05-9943-4bd8-b058-e0804a07d0be", {
    locale: "es-AR"
    });

    // Mostrar el carrito
    const displayCart = () => {
    modalContainer.innerHTML = "";
    modalContainer.style.display = "block";
    modalOverlay.style.display = "block";

    modalContainer.appendChild(createModalHeader());

    if (cart.length === 0) {
        const emptyText = document.createElement("div");
        emptyText.className = "modal-body";
        emptyText.innerText = "Tu carrito está vacío 🛒";
        modalContainer.appendChild(emptyText);
        return;
    }

    currentTotalPrice = cart.reduce((acc, product) => acc + (product.price * product.quantity), 0);

    cart.forEach(product => {
        modalContainer.appendChild(createProductCard(product));
    });

    modalContainer.appendChild(createModalFooter(currentTotalPrice));

    // Activar botón de checkout
    const checkoutButton = document.getElementById("checkout-btn");
    //checkoutButton.addEventListener("click", handleCheckout);
    // Checkout handler
    checkoutButton.addEventListener("click", async () => {
    try{
            var titulo = ""
            cart.forEach(p => titulo += p.productName);
            const orderData = {
                title: "Productos CapyMarket",
                quantity: 1,
                description: "Compra de CapyMarket",
                price: currentTotalPrice,
                };

                const response = await fetch("http://localhost:8080/create_preference", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(orderData),
            });
            const preference = await response.json()
            createCheckoutButton(preference.id);
        } catch(error){
            //alert("Error inesperado.");
            console.log(error);
        }
    })
};

// Crear encabezado del modal
const createModalHeader = () => {
    const header = document.createElement("div");

    const closeBtn = document.createElement("div");
    closeBtn.innerText = "❌";
    closeBtn.className = "modal-close";
    closeBtn.addEventListener("click", closeModal);

    const title = document.createElement("div");
    title.innerText = "Carrito de compras";
    title.className = "modal-title";

    header.append(closeBtn, title);
    return header;
};

// Crear tarjeta de producto
const createProductCard = (product) => {
    const body = document.createElement("div");
    body.className = "modal-body";
    body.innerHTML = `
        <div class="product-cart">
        <img src="${product.image}" alt="${product.productName}" class="modal-product-img">
        <div class="product-info">
            <h3 class="modal-product-name">${product.productName}</h3>
            <p class="modal-product-price">$${product.price}</p>
        </div>
        <div class="quantity-cart">
            <button class="quantity-btn-decrease" onclick="decrementQuantity(${product.id})">-</button>
            <span class="quantity-input" id="quantity-${product.id}">${product.quantity}</span>
            <button class="quantity-btn-increase" onclick="incrementQuantity(${product.id})">+</button>
        </div>
        <div class="price" id="price-${product.id}"> $${product.price * product.quantity}</div>
        <div class="delete-product" onclick="removeProduct(${product.id})">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 16 16">
	        <path fill="#c32020" d="M2 5v10c0 .55.45 1 1 1h9c.55 0 1-.45 1-1V5zm3 9H4V7h1zm2 0H6V7h1zm2 0H8V7h1zm2 0h-1V7h1zm2.25-12H10V.75A.753.753 0 0 0 9.25 0h-3.5A.753.753 0 0 0 5 .75V2H1.75a.75.75 0 0 0-.75.75V4h13V2.75a.75.75 0 0 0-.75-.75M9 2H6v-.987h3z" />
            </svg>
        </div>
        </div>
    `;
    return body;
    };

// Crear pie del modal
const createModalFooter = (totalPrice) => {
    const footer = document.createElement("div");
    footer.className = "modal-footer";
    footer.innerHTML = `
        <div class="total-price">
        <p>Total: $ ${totalPrice}</p>
        </div>
        <button class="btn-primary" id="checkout-btn">Checkout</button>
        <div id="walletBrick_container" class="boton-mp"></div>
        <div id="button-checkout"></div>
    `;
    return footer;
    };

    // Cerrar modal
    const closeModal = () => {
    modalContainer.style.display = "none";
    modalOverlay.style.display = "none";
};

// Renderizar botón de pago
const createCheckoutButton = (preferenceId) => {
    const bricksBuilder = mercadopago.bricks();
    const renderComponent = async (bricksBuilder) => {
        if(window.checkoutButton) window.checkoutButton.unmount();
        const checkoutButton = document.getElementById("checkout-btn");
        if (checkoutButton != null) checkoutButton.style="display:none";
        await bricksBuilder.create("wallet", "walletBrick_container", {
        initialization: {
            preferenceId: preferenceId,
            redirectMode:'modal',
        },
        callbacks: {
            onError: (error) => console.error(error),
            onReady: () => {},
        },
        });
    };
    renderComponent(bricksBuilder);
}

// Cantidad
const incrementQuantity = id => {
    const productInCart = cart.find((product) => product.id === id);
    const productStock = productos.find((product) => product.id === id).quantity;

    if (productInCart.quantity < productStock) {
        productInCart.quantity++;
        displayCart();
        displayCartCounter();
    } else {
        alert("No hay suficiente stock disponible");
    }
};

const decrementQuantity = (id) => {
    const productInCart = cart.find((product) => product.id === id);
    if (productInCart.quantity > 1) {
        productInCart.quantity--;
        displayCart();
        displayCartCounter();
    } else {
        alert("La cantidad no puede ser menor a 1. Si deseas eliminar el producto, haz clic en el icono de eliminar.");
    }
};

// Eliminar producto
const removeProduct = (id) => {
    const productIndex = cart.findIndex((product) => product.id === id);
    if (productIndex !== -1) {
        const productInCart = cart[productIndex];
        const productStock = productos.find((product) => product.id === id);
        productStock.quantity += productInCart.quantity;

        cart.splice(productIndex, 1);
        displayCart();
        displayCartCounter();
    }
};

// Contador
const displayCartCounter = () => {
    console.log("calling displayCartCounter")
    const cartLength = cart.reduce((acc, product) => acc + product.quantity, 0);
    console.log("tamaño", cartLength);
    cartCounter.style.display = cartLength > 0 ? "block" : "none";
    cartCounter.innerText = cartLength;
};

cartBtn.addEventListener("click", displayCart);