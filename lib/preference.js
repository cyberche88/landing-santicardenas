/**
 * Preferencia de pago MercadoPago — Código del Futuro
 * Compartido por netlify/functions/create-preference.js (producción)
 * y server.js (desarrollo local).
 */

const { MercadoPagoConfig, Preference } = require('mercadopago');

const TICKET = {
    id:          'CDF-2026-ENTRADA',
    title:       'Código del Futuro — Boleta SC',
    description: '18 de octubre 2026 · Ágora Centro de Convenciones · Bogotá',
    category_id: 'tickets',
    unit_price:  Number(process.env.TICKET_PRICE_COP) || 299000,
    currency_id: 'COP'
};

function getAccessToken() {
    return process.env.MP_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN || '';
}

/**
 * @param {object} buyer  { name, email, phone, country }
 * @param {string} siteUrl URL pública (sin barra final). Si es localhost no se
 *                         envían back_urls ni notification_url (MP las rechaza).
 */
async function createPreference(buyer, siteUrl) {
    const accessToken = getAccessToken();
    if (!accessToken) throw new Error('MP_ACCESS_TOKEN no configurado');

    const name  = String(buyer.name  || '').trim().slice(0, 100);
    const email = String(buyer.email || '').trim().slice(0, 200);
    const phone = String(buyer.phone || '').replace(/\D/g, '').slice(-10);
    const country = String(buyer.country || 'CO');
    const isLocal = /localhost|127\.0\.0\.1/.test(siteUrl);

    const client = new MercadoPagoConfig({ accessToken, options: { timeout: 8000 } });
    const result = await new Preference(client).create({
        body: {
            items: [{ ...TICKET, quantity: 1 }],

            payer: {
                name:  name || undefined,
                // En local (credenciales TEST) no enviamos el email: si coincide
                // con el del vendedor MercadoPago rechaza el pago.
                email: !isLocal && email ? email : undefined,
                phone: phone ? { area_code: country === 'CO' ? '57' : '', number: phone } : undefined
            },

            ...(!isLocal && {
                back_urls: {
                    success: `${siteUrl}/gracias.html?status=approved`,
                    pending: `${siteUrl}/gracias.html?status=pending`,
                    failure: `${siteUrl}/?status=rejected#entradas`
                },
                auto_return: 'approved',
                notification_url: `${siteUrl}/.netlify/functions/webhook`
            }),

            statement_descriptor: 'BE IMPARABLES',
            external_reference:   `CDF-SC-${Date.now()}`,
            metadata: { event: 'Código del Futuro', date: '2026-10-18', city: 'Bogota', seller: 'Santi Cardenas' }
        }
    });

    return {
        id:                 result.id,
        init_point:         result.init_point,
        sandbox_init_point: result.sandbox_init_point
    };
}

module.exports = { createPreference, getAccessToken, TICKET };
