/**
 * Netlify Function — Webhook de notificaciones MercadoPago
 * URL: /.netlify/functions/webhook
 *
 * Para ver los logs en tiempo real:
 * Netlify Dashboard → tu sitio → Functions → webhook → Ver logs
 */

const { MercadoPagoConfig, Payment } = require('mercadopago');

// Tabla de motivos de rechazo de MercadoPago en español
const REJECTION_REASONS = {
    cc_rejected_bad_filled_card_number: '❌ Número de tarjeta mal ingresado',
    cc_rejected_bad_filled_date:        '❌ Fecha de vencimiento incorrecta',
    cc_rejected_bad_filled_other:       '❌ Datos de tarjeta incorrectos',
    cc_rejected_bad_filled_security_code: '❌ CVV incorrecto',
    cc_rejected_blacklist:              '❌ Tarjeta bloqueada por el banco',
    cc_rejected_call_for_authorize:     '❌ Banco requiere autorización manual — cliente debe llamar al banco',
    cc_rejected_card_disabled:          '❌ Tarjeta no habilitada para compras online',
    cc_rejected_card_error:             '❌ Error procesando la tarjeta',
    cc_rejected_duplicated_payment:     '❌ Pago duplicado detectado',
    cc_rejected_high_risk:              '❌ Rechazado por sistema antifraude',
    cc_rejected_insufficient_amount:    '❌ Fondos insuficientes',
    cc_rejected_invalid_installments:   '❌ Cuotas no permitidas para esta tarjeta',
    cc_rejected_max_attempts:           '❌ Máximo de intentos alcanzado — tarjeta bloqueada temporalmente',
    cc_rejected_other_reason:           '❌ Rechazo del banco sin motivo especificado',
    pending_contingency:                '⏳ Pago pendiente — procesando',
    pending_review_manual:              '⏳ En revisión manual por MercadoPago',
};

exports.handler = async (event) => {
    // GET simple para verificar que el webhook está activo
    if (event.httpMethod === 'GET') {
        return {
            statusCode: 200,
            body: JSON.stringify({ ok: true, msg: 'Webhook activo ✓', ts: new Date().toISOString() })
        };
    }

    console.log('═══════════════════════════════════════');
    console.log('[Webhook] Notificación recibida');
    console.log('[Webhook] Body:', event.body);
    console.log('═══════════════════════════════════════');

    let body = {};
    try { body = JSON.parse(event.body || '{}'); } catch (_) {}

    const { type, data, action } = body;

    // Responder 200 inmediatamente para que MP no reintente
    if (type === 'payment' && data?.id) {
        try {
            const client  = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
            const payment = await new Payment(client).get({ id: data.id });

            const motivo = REJECTION_REASONS[payment.status_detail] || payment.status_detail || 'sin detalle';

            console.log('─── DETALLE DEL PAGO ───────────────────');
            console.log(`  ID:              ${payment.id}`);
            console.log(`  Estado:          ${payment.status}`);
            console.log(`  Motivo detalle:  ${payment.status_detail}`);
            console.log(`  Descripción:     ${motivo}`);
            console.log(`  Método:          ${payment.payment_method_id} / ${payment.payment_type_id}`);
            console.log(`  Monto:           $${payment.transaction_amount} ${payment.currency_id}`);
            console.log(`  Pagador:         ${payment.payer?.email}`);
            console.log(`  Referencia:      ${payment.external_reference}`);
            console.log(`  Banco emisor:    ${payment.card?.cardholder?.name || 'N/A'}`);
            console.log('────────────────────────────────────────');

            if (payment.status === 'approved') {
                console.log(`✅ BOLETA CONFIRMADA — ${payment.payer?.email}`);
            } else if (payment.status === 'rejected') {
                console.log(`🚨 PAGO RECHAZADO — Motivo: ${motivo}`);
                console.log(`   → Acción sugerida: ${getSuggestion(payment.status_detail)}`);
            } else if (payment.status === 'pending' || payment.status === 'in_process') {
                console.log(`⏳ PAGO PENDIENTE — ${payment.payer?.email}`);
            }

        } catch (err) {
            console.error('[Webhook] Error consultando pago:', err?.message);
        }
    }

    return { statusCode: 200, body: 'OK' };
};

function getSuggestion(statusDetail) {
    const suggestions = {
        cc_rejected_card_disabled:       'El cliente debe habilitar compras online en la app de su banco',
        cc_rejected_call_for_authorize:  'El cliente debe llamar a su banco para autorizar el pago',
        cc_rejected_insufficient_amount: 'El cliente no tiene fondos suficientes',
        cc_rejected_high_risk:           'MercadoPago bloqueó por antifraude — contactar soporte MP',
        cc_rejected_max_attempts:        'Demasiados intentos — el cliente debe esperar 24h',
        cc_rejected_blacklist:           'Tarjeta bloqueada — el cliente debe contactar su banco',
    };
    return suggestions[statusDetail] || 'Revisar con el cliente qué banco y tipo de tarjeta usó';
}
