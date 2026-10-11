/**
 * Netlify Function — Crear preferencia de pago MercadoPago
 * Se invoca vía /create-preference (redirect en netlify.toml).
 * Variable de entorno requerida: MP_ACCESS_TOKEN (o MERCADOPAGO_ACCESS_TOKEN)
 */

const { createPreference, getAccessToken } = require('../../lib/preference');

const HEADERS = {
    'Content-Type':  'application/json',
    'Cache-Control': 'no-store'
};

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers: HEADERS, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    if (!getAccessToken()) {
        console.error('[MP] MP_ACCESS_TOKEN no configurado');
        return { statusCode: 500, headers: HEADERS, body: JSON.stringify({ error: 'Servidor mal configurado' }) };
    }

    let buyer = {};
    try { buyer = JSON.parse(event.body || '{}'); } catch (_) {}

    // En producción URL es el dominio principal (soysanticardenas.com);
    // en deploy previews usamos la URL del preview.
    const siteUrl = (process.env.CONTEXT === 'production'
        ? process.env.URL
        : process.env.DEPLOY_PRIME_URL || process.env.URL) || 'https://soysanticardenas.com';

    try {
        const pref = await createPreference(buyer, siteUrl);
        console.log(`[MP] Preferencia ${pref.id} — ${buyer.name || ''} <${buyer.email || ''}> — ${siteUrl}`);
        return { statusCode: 200, headers: HEADERS, body: JSON.stringify(pref) };
    } catch (err) {
        console.error('[MP] Error creando preferencia:', err?.message || err);
        return { statusCode: 500, headers: HEADERS, body: JSON.stringify({ error: 'No se pudo crear la preferencia de pago' }) };
    }
};
