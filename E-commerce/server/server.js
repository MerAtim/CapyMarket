import express from "express";
import cors from "cors";
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({
    accessToken: 'APP_USR-5056574560531615-090123-7edbab2ac12d72ea938afdaaf950377d-2660554541', //<--vendedor
});

    // Ya podés usar mercadopago directamente sin instanciar ni configurar
    const app = express();
    const port = 8080;
    app.use(cors());
    app.use(express.json());
    
    app.get("/", (req, res) => {
    res.send("Soy el server");
    });

    app.post("/create_preference", async (req, res) => {
        try{
            const body = {
                items: [{
                    title: req.body.title,
                    quantity: Number(req.body.quantity),
                    unit_price: Number(req.body.price),
                    currency_id: "ARS",
                },
            ],
            back_urls:{
                success: "https://www.youtube.com",
                failure: "https://www.youtube.com/@onthecode",
                pending: "https://www.youtube.com/live/bRb5GiXad1U"
            },
            auto_return: "approved"
        };
        //console.log(body)
        const preference = new Preference(client);
        const result = await preference.create({body});
        res.json({
            id: result.id,
        })
        }catch(error){
            console.log(error);
            result.status(500).json({
                error: "Error al crear la preferencia"
            })
        }
    });

    app.listen(port, () => {
        console.log(`El servidor esta corriendo en el puerto ${port}`);
        
    });



    /*
    

// Para usar __dirname en ESModules
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    app.post("/create_preference", async (req, res) => {
    try {
        const preference = {
        items: [
            {
            title: req.body.description,
            unit_price: Number(req.body.price),
            quantity: Number(req.body.quantity),
            },
        ],
        back_urls: {
            success: "http://localhost:8080",
            failure: "http://localhost:8080",
            pending: "",
        },
        auto_return: "approved",
        };

        const response = await client.preferences.create(preference);
        res.json({ id: response.id });
    } catch (error) {
        console.error("Error al crear la preferencia:", error);
        res.status(500).send("Error al crear la preferencia" + error);
    }
    });

    app.post("/create_preference", async (req, res) => {
        const preference = new Preference(client);
        let response = preference.create({
            body: {
                items: [
                    {
                    title: req.body.description,
                    unit_price: Number(req.body.price),
                    quantity: req.body.quantity
                    }
                ]}
        })
        .then(console.log)
        .catch(console.log);

        return response;
    });

    app.get("/feedback", function (req, res) {
    res.json({
        Payment: req.query.payment_id,
        Status: req.query.status,
        MerchantOrder: req.query.merchant_order_id,
    });
    });

    app.listen(8080, () => {
    console.log("✅ El servidor está corriendo en el puerto 8080");
    });*/