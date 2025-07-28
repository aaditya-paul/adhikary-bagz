# Stripe Integration Setup Guide

## Overview

Your Nomada e-commerce website now has Stripe integration for secure payment processing. Here's what has been implemented:

## What's Been Added

### 1. Stripe API Route (`/app/api/create-payment-intent/route.js`)

- Creates payment intents for secure payment processing
- Handles amount validation (minimum $0.50)
- Supports metadata for order tracking

### 2. Updated PaymentForm Component

- Now uses Stripe Elements for secure card input
- Includes CardNumberElement, CardExpiryElement, and CardCvcElement
- Real-time validation and error handling
- PCI-compliant card data handling

### 3. Enhanced Checkout Process

- Integration with Stripe payment methods
- Secure payment intent creation
- Order tracking with payment metadata

## Required Environment Variables

Create a `.env.local` file in your project root with:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
```

## How to Get Stripe Keys

1. **Sign up for Stripe**: Go to https://stripe.com and create an account
2. **Get Test Keys**:
   - Go to Dashboard → Developers → API keys
   - Copy the "Publishable key" (starts with `pk_test_`)
   - Copy the "Secret key" (starts with `sk_test_`)
3. **Add to Environment**: Replace the placeholder values in `.env.local`

## Testing the Integration

### Test Card Numbers (Stripe Test Mode)

- **Visa**: 4242424242424242
- **Visa (declined)**: 4000000000000002
- **Mastercard**: 5555555555554444
- **American Express**: 378282246310005

### Test Details

- **Expiry**: Any future date (e.g., 12/25)
- **CVC**: Any 3-4 digits (e.g., 123)
- **ZIP**: Any valid ZIP code

## Features

### Security

- ✅ PCI-compliant payment processing
- ✅ No sensitive card data stored in your database
- ✅ Secure tokenization through Stripe
- ✅ Encrypted data transmission

### User Experience

- ✅ Real-time card validation
- ✅ Intuitive error messages
- ✅ Mobile-responsive design
- ✅ Save card preferences

### Integration

- ✅ Firebase order storage
- ✅ User order history
- ✅ Payment metadata tracking
- ✅ Order confirmation flow

## Next Steps

1. **Set up your Stripe account** and get your API keys
2. **Add environment variables** to `.env.local`
3. **Test the payment flow** using test card numbers
4. **Configure webhooks** (optional) for advanced payment status updates
5. **Switch to live mode** when ready for production

## Production Checklist

- [ ] Replace test keys with live keys
- [ ] Test with small real transactions
- [ ] Set up webhook endpoints for payment confirmations
- [ ] Configure proper error logging
- [ ] Review and test refund processes

## Support

- **Stripe Documentation**: https://stripe.com/docs
- **Stripe Dashboard**: https://dashboard.stripe.com
- **Test Cards**: https://stripe.com/docs/testing#cards

## Troubleshooting

### Common Issues

**Error: `serverTimestamp() can only be used with update() and set()`**

- **Solution**: This has been fixed in the codebase. We use `serverTimestamp()` for the main document and regular timestamps for `arrayUnion()` operations.

**Error: `userOrdersResult.orders.map is not a function`**

- **Solution**: This has been fixed in the codebase. We now properly validate that the orders field is an array and handle cases where it might be null, undefined, or malformed.

**Error: `Maximum call stack size exceeded`**

- **Solution**: Check for circular dependencies in useEffect hooks. Ensure dependency arrays are stable.

**Payment fails silently**

- **Solution**: Check browser console for errors and verify your Stripe keys are correct.

Your payment integration is now ready for testing! 🚀
