# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

## Users

People who buy vinyl records through the Spinova mobile app.

## Product Purpose

Spinova allows users to discover vinyl records, save favorites, manage a cart, and complete purchases in a mobile experience.

## Operating Context

The primary user flow covers catalog browsing, product details, cart, and checkout.

## Capabilities and Constraints

- React Native application using Expo Router for iOS and Android.
- Checkout must preserve contact information, shipping address, payment details, and order summary before confirmation.
- Order creation and payment integration remain open architectural decisions.

## Brand Commitments

The Spinova brand name, dark theme identity, accent red, Syne and Golos Text typography, and existing app assets must be preserved.

## Evidence on Hand

- Existing implementation in `app/` and `src/`.
- Checkout visual reference provided by the user in `C:/Users/Vinicius/Downloads/Check-out.png`.
- No confirmed production data for address, phone number, or payment cards.

## Product Principles

- Make the journey from discovery to checkout straightforward and readable.
- Maintain consistency across catalog, cart, and checkout.
- Do not fabricate payment or order confirmations without real backend integration.
