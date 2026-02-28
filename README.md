
# Payment Gateway – Razorpay/Stripe Inspired

📌 Project Overview

This project is a simplified Payment Gateway System inspired by modern fintech platforms such as Razorpay and Stripe. It enables merchants to securely create payment orders via API and allows customers to complete payments through a hosted checkout page.

The system simulates real-world payment workflows including authentication, validation logic, transaction lifecycle management, and secure handling of financial data.

Key Features

🔐 Secure Merchant Authentication (API Key + Secret)

📦 Order Creation & Retrieval APIs

💳 Multi-Method Payment Processing (UPI & Card)

🛒 Hosted Checkout Page

📊 Merchant Dashboard with Transaction Analytics

🐳 Fully Dockerized Deployment (Single Command Setup)



---

🎯 Objective

The primary objectives of this project are:

1. Implement secure API-based merchant authentication.


2. Manage the complete order lifecycle.


3. Validate and process UPI and Card payments.


4. Enforce a strict payment state machine.


5. Provide a seamless hosted checkout experience.


6. Offer a dashboard for merchants to track transactions.


7. Ensure complete containerized deployment using Docker Compose.




---

🏗️ System Architecture

The application is composed of four independent services:

Service	Port	Description

PostgreSQL	5432	Database Service
Backend API	8000	REST API Service
Dashboard	3000	Merchant Interface
Checkout Page	3001	Hosted Payment Interface


All services are orchestrated using Docker Compose.

Start the entire system with:

docker-compose up -d


---

🚀 Setup Instructions

1️⃣ Clone the Repository

git clone <repository-url>
cd payment-gateway

2️⃣ Start All Services

docker-compose up -d

This automatically starts:

postgres

api

dashboard

checkout


3️⃣ Access the Application

API Base URL → http://localhost:8000

Dashboard → http://localhost:3000

Checkout → http://localhost:3001


No manual configuration is required.


---

🔐 Test Merchant (Auto-Seeded)

On startup, the application automatically seeds a test merchant:

Field	Value

ID	550e8400-e29b-41d4-a716-446655440000
Email	test@example.com
API Key	key_test_abc123
API Secret	secret_test_xyz789


If the merchant already exists, the system safely skips insertion.


---

🗄️ Database Schema

Merchants Table

id (UUID, Primary Key)

name

email (unique, not null)

api_key (unique, not null)

api_secret (not null)

webhook_url (optional)

is_active (default: true)

created_at

updated_at


Orders Table

id (order_ + 16 alphanumeric characters)

merchant_id (Foreign Key → merchants.id)

amount (integer, minimum 100 paise)

currency (default: INR)

receipt (optional)

notes (JSON)

status (default: created)

created_at

updated_at


Payments Table

id (pay_ + 16 alphanumeric characters)

order_id (Foreign Key → orders.id)

merchant_id (Foreign Key → merchants.id)

amount

currency

method (upi | card)

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

🔑 API Endpoints

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

Authentication

All endpoints except /health and /api/v1/test/merchant require:

X-Api-Key
X-Api-Secret


---

❗ Standard Error Codes

AUTHENTICATION_ERROR

BAD_REQUEST_ERROR

NOT_FOUND_ERROR

INVALID_VPA

INVALID_CARD

EXPIRED_CARD

PAYMENT_FAILED



---

💳 Payment Validation Logic

UPI Validation

Validated using the regex:

^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$

Card Validation

Luhn Algorithm for card number validation

Network detection (Visa, Mastercard, Amex, RuPay)

Expiry date validation (must be current or future month)

Only last 4 digits stored

CVV and full card numbers are never stored



---

🔄 Payment State Machine

Payments follow a strict state transition model:

processing → success
processing → failed

Payments are created directly in the processing state.
No other transitions are allowed.


---

🧪 Test Mode (Deterministic Evaluation)

Environment Variables:

TEST_MODE=true
TEST_PAYMENT_SUCCESS=true
TEST_PROCESSING_DELAY=1000

When enabled:

Payment outcome becomes deterministic.

Processing delay becomes fixed.


When disabled:

UPI success rate: 90%

Card success rate: 95%

Random delay between 5–10 seconds.



---

📊 Dashboard Features

Secure Login Page

API Credentials Display

Real-time Transaction Statistics

Transactions Table


Statistics include:

Total Transactions

Total Successful Amount

Success Rate (%)


All values are dynamically calculated from the database.


---

🛒 Checkout Flow

Checkout URL format:

http://localhost:3001/checkout?order_id=order_xxxxxxxxxxxxxxxx

Flow:

1. Fetch order details


2. Select payment method


3. Submit payment


4. Display processing state


5. Poll payment status every 2 seconds


6. Show success or failure



The checkout page interacts only through API endpoints and never directly accesses the database.


---

🔒 Security Practices

API Key + Secret authentication for merchants

Strict request validation

Standardized error handling

No storage of full card numbers

No CVV storage

Deterministic test mode for secure evaluation



---

✅ Conclusion

This project demonstrates real-world fintech system design, including:

Secure API authentication

Payment validation algorithms

Strict transaction lifecycle management

Full Docker-based deployment

End-to-end integration between backend and frontend


The system is evaluation-ready, production-structured, and follows best practices for financial application development.


---

