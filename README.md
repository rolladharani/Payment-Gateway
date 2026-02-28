---
#Payment Gateway – Razorpay/Stripe Inspired

## Project Overview

This project is a simplified Payment Gateway System inspired by modern fintech platforms like Razorpay and Stripe. It allows merchants to securely create payment orders and enables customers to complete payments using a hosted checkout page.

The system includes:

Secure Merchant Authentication (API Key + Secret)

Order Creation & Retrieval APIs

Payment Processing (UPI & Card)

Hosted Checkout Page

Merchant Dashboard

Fully Dockerized Deployment


This project simulates real-world fintech workflows including validation logic, transaction lifecycle management, and secure payment handling.


---

## Objective

The main objective of this project is to:

1. Implement secure API authentication.


2. Manage order lifecycle.


3. Validate and process UPI and Card payments.


4. Implement a correct payment state machine.


5. Provide a hosted checkout experience.


6. Offer a merchant dashboard for transaction tracking.


7. Ensure complete Docker-based deployment.




---

## System Architecture

The system consists of four services:

Service	Port	Description

PostgreSQL	5432	Database
Backend API	8000	REST API Service
Dashboard	3000	Merchant Interface
Checkout	3001	Hosted Payment Page


All services start using:

docker-compose up -d


---

## Setup Instructions

1️⃣ Clone Repository

git clone <repository-url>
cd payment-gateway

2️⃣ Start Application

docker-compose up -d

This will start:

postgres

api

dashboard

checkout


3️⃣ Access Services

API → http://localhost:8000

Dashboard → http://localhost:3000

Checkout → http://localhost:3001


No manual setup required.


---

## Test Merchant (Auto-Seeded)

The application automatically seeds a test merchant:

Field	Value

ID	550e8400-e29b-41d4-a716-446655440000
Email	test@example.com
API Key	key_test_abc123
API Secret	secret_test_xyz789


If already exists, insertion is skipped safely.


---

## Database Schema

Merchants

id (UUID, PK)

name

email (unique)

api_key (unique)

api_secret

webhook_url

is_active (default true)

created_at

updated_at


Orders

id (order_ + 16 alphanumeric chars)

merchant_id (FK)

amount (>=100 paise)

currency (default INR)

receipt

notes (JSON)

status (default: created)

created_at

updated_at


Payments

id (pay_ + 16 alphanumeric chars)

order_id (FK)

merchant_id (FK)

amount

currency

method (upi/card)

status (processing → success/failed)

vpa (UPI only)

card_network (card only)

card_last4 (card only)

error_code

error_description

created_at

updated_at


Required Indexes

orders.merchant_id

payments.order_id

payments.status



---

## API Endpoints

Health Check

GET /health

Orders

POST /api/v1/orders
GET  /api/v1/orders/{order_id}

Payments

POST /api/v1/payments
GET  /api/v1/payments/{payment_id}

Test Endpoint

GET /api/v1/test/merchant

Authentication Required

All endpoints (except /health and test endpoint) require:

X-Api-Key
X-Api-Secret


---

## Standard Error Codes

AUTHENTICATION_ERROR

BAD_REQUEST_ERROR

NOT_FOUND_ERROR

INVALID_VPA

INVALID_CARD

EXPIRED_CARD

PAYMENT_FAILED



---

## Payment Validation Logic

UPI Validation

Regex pattern:

^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$

Card Validation

Luhn Algorithm

Card Network Detection (Visa, Mastercard, Amex, RuPay)

Expiry Date Validation

Store only last 4 digits

Never store CVV or full card number



---

## Payment State Machine

processing → success
processing → failed

Payments are created directly in processing state.


---

## Test Mode (For Automated Evaluation)

Environment Variables:

TEST_MODE=true
TEST_PAYMENT_SUCCESS=true
TEST_PROCESSING_DELAY=1000

When enabled:

Payment outcome becomes deterministic

Delay becomes fixed


When disabled:

UPI success rate: 90%

Card success rate: 95%

Random delay between 5–10 seconds



---

## Dashboard Features

Login Page

API Credentials Display

Transaction Statistics

Transactions Table


Statistics calculated dynamically:

Total Transactions

Total Successful Amount

Success Rate %



---

## Checkout Flow

Checkout URL format:

http://localhost:3001/checkout?order_id=order_xxxxxxxxxxxxxxxx

Flow:

1. Fetch order details


2. Select payment method


3. Submit payment


4. Show processing state


5. Poll payment status


6. Display success or failure




---

## Security Practices

API Key + Secret authentication

Strict input validation

Standardized error handling

No storage of full card numbers

No CVV storage

Deterministic test mode for safe evaluation



---

