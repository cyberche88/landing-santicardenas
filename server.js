/**
 * Servidor local de desarrollo — Código del Futuro · Santi Cardenas
 *
 * Sirve la landing estática y ejecuta las mismas Netlify Functions que
 * corren en producción (create-preference, webhook).
 *
 * SETUP:
 *   1. npm install
 *   2. Copia .env.example → .env y rellena MP_ACCESS_TOKEN
 *   3. npm start  →  http://localhost:3000
 */

require('dotenv').config();
const express = require('express');
const path    = require('path');

const createPreference = require('./netlify/functions/create-preference');
const webhook          = require('./netlify/functions/webhook');

const PORT = process.env.PORT || 3000;
// create-preference usa URL/DEPLOY_PRIME_URL como en Netlify
process.env.URL = process.env.BASE_URL || `http://localhost:${PORT}`;

const app = express();
app.use(express.text({ type: '*/*' }));
app.use(express.static(path.join(__dirname)));

// Adaptador Express → handler estilo Netlify
const run = (handler) => async (req, res) => {
    const out = await handler({
        httpMethod: req.method,
        headers:    req.headers,
        body:       typeof req.body === 'string' ? req.body : ''
    });
    res.status(out.statusCode).set(out.headers || {}).send(out.body);
};

app.all(['/create-preference', '/.netlify/functions/create-preference'], run(createPreference.handler));
app.all(['/webhook', '/.netlify/functions/webhook'], run(webhook.handler));

app.listen(PORT, () => {
    const token = process.env.MP_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN || '';
    const mode  = token.startsWith('TEST-') ? 'SANDBOX' : 'PRODUCCIÓN';
    console.log(`\n  🌐  Landing:      http://localhost:${PORT}`);
    console.log(`  💳  MercadoPago:  ${token ? `configurado (${mode})` : '⚠ MP_ACCESS_TOKEN no configurado'}\n`);
});
