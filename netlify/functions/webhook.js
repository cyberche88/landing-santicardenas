/**
 * Netlify Function — Webhook de notificaciones MercadoPago
 * Recibe actualizaciones de estado de pago en tiempo real.
 * URL: /.netlify/functions/webhook
 */

const { MercadoPagoConfig, Payment } = require('mercadopago');

exports.handler = async (event) => {
    // Responder 200 inmediatamente para que MP no reintente
    const { type, data } = JSON.parse(event.body || '{}');
    console.log(`[Webhook] type=${type} id=${data?.id}`);

    if (type === 'payment' && data?.id) {
        try {
            const client  = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
            const payment = await new Payment(client).get({ id: data.id });

            console.log(`[Webhook] Pago ${data.id} — Estado: ${payment.status} — ${payment.payer?.email}`);

            // TODO: aquí puedes conectar tu base de datos / enviar email de confirmación
            if (payment.status === 'approved') {
                console.log(`✅ BOLETA CONFIRMADA — ${payment.payer?.email} — Ref: ${payment.external_reference}`);
            }
        } catch (err) {
            console.error('[Webhook] Error:', err?.message);
        }
    }

    return { statusCode: 200, body: 'OK' };
};
