const functions = require('firebase-functions');
const crypto = require('crypto');
const cors = require('cors')({ origin: true });  // This will allow all origins

const MERCHANT_KEY = "QGsKaO";
const SALT = "trgJlwhrrdVnCu9ZRo2GdaXmBvpfMHrp";

exports.generateHash = functions.https.onRequest((req, res) => {
    // Enable CORS before the function logic
    cors(req, res, () => {
        if (req.method !== 'POST') {
            return res.status(405).send('Method Not Allowed');
        }

        const { txnid, amount, productinfo, firstname, email } = req.body;

        if (!txnid || !amount || !productinfo || !firstname || !email) {
            return res.status(400).send('Missing required parameters');
        }

        const hashString = `${MERCHANT_KEY}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${SALT}`;
        const hash = crypto.createHash('sha512').update(hashString).digest('hex');

        const surl = "https://catalystdesign5.github.io/StockMarketBible/succes.html";
        const furl = "https://catalystdesign5.github.io/StockMarketBible/failure.html";

        // Return the generated hash as a JSON response
        res.status(200).json({ hash , surl, furl , MERCHANT_KEY});
    });
});


exports.payUWebhook = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        if (req.method !== 'POST') {
            return res.status(405).send('Method Not Allowed');
        }

        const paymentData = req.body;

        // Basic validation and processing of the payment data
        if (paymentData.status === 'success') {
            console.log("Payment was successful:", paymentData);
            // Optional: Store success data in your database or trigger any further business logic
            res.redirect("https://catalystdesign5.github.io/StockMarketBible/succes.html?status=success");
        } else if (paymentData.status === 'failure') {
            console.log("Payment failed:", paymentData);
            // Optional: Log or handle failure case as needed
            res.redirect("https://catalystdesign5.github.io/StockMarketBible/failure.html?status=failure");
        }

        res.sendStatus(200);  // Acknowledge receipt of the webhook
    });
});