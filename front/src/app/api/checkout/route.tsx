import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Instancia correctamente Stripe con tu clave secreta
const stripe = new Stripe('sk_test_51Q7otE00ffkRUeeSNKqMZLAVvxk5Eb0hwkkw7cVVYWiWPIPPTSe2fu4p3074vbNxPALEERydW5Vxw6VrKLVgpoq100Y1WEh078', {
  
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { appointmentId, description, unitAmount, quantity } = body; // Extraer los datos recibidos desde el front-end

    // Crear la sesión de Stripe con los detalles recibidos
    const session = await stripe.checkout.sessions.create({
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
      line_items: [
        {
          price_data: {
            currency: 'usd', // Cambia la moneda si es necesario
            product_data: {
              name: description, // Agregar la descripción personalizada aquí
            },
            unit_amount: unitAmount, // El precio en centavos (por ejemplo, 5000 es $50.00)
          },
          quantity: quantity,
        },
      ],
      mode: 'payment',
    });

    // Responder con el ID de la sesión de Stripe
    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creando la sesión de pago:', error);
    return NextResponse.json({ error: 'Error creando la sesión de pago' }, { status: 500 });
  }
}
