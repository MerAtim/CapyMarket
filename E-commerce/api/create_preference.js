import mercadopago from "mercadopago";

// Configura MercadoPago con tu Access Token
mercadopago.configurations.setAccessToken(process.env.ACCESS_TOKEN);

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
        const { items } = req.body;

        const preference = {
            items,
            back_urls: {
            success: "https://capymarket.netlify.app/gracias.html", // Cambia por tu URL de éxito
            failure: "https://capymarket.netlify.app/index.html",   // Cambia por tu URL de fallo
            pending: "https://capymarket.netlify.app/index.html", // Cambia por tu URL de pendiente
            },
            auto_return: "approved", // Redirige automáticamente si se aprueba el pago
        };

        const response = await mercadopago.preferences.create(preference);

        res.status(200).json({
            init_point: response.body.init_point, // Devuelve URL del checkout
        });
        } catch (error) {
        console.error("Error al crear la preferencia:", error.message);
        res.status(500).json({ error: "Hubo un problema al crear la preferencia" });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}