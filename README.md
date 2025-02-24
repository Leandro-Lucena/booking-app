# Property Booking System

This project is a learning activity in **Test-Driven Development (TDD)**, inspired by platforms like Airbnb. The goal is to allow users to book properties, check availability, and cancel bookings according to predefined policies. The project was developed using TDD best practices, resulting in a total of **72 automated tests**, covering unit, integration, and end-to-end tests.

## Technologies Used

- **Language:** Node.js
- **Database:** SQLite3
- **ORM:** TypeORM
- **Testing:** Jest and Supertest

## Tested Features

### 📌 Bookings

- Verification of property availability before booking.
- Calculation of total price based on the price per night and number of nights booked.
- **Automatic Discount:** 10% discount for bookings of 7 nights or more.
- Booking registration and blocking of the property for the reserved period.

### ❌ Booking Cancellations

- Cancellations follow the refund policy:
  - **More than 7 days before check-in:** Full refund.
  - **Between 1 and 7 days before check-in:** Partial refund (50%).
  - **Less than 1 day before check-in:** No refund.
- Update of booking status to "CANCELLED" and release of the property for new bookings.
- Prevention of cancellations for already canceled bookings, with appropriate messages.

### 🔍 Data Validation

- The system validates the number of guests:
  - Must be greater than zero.
  - Cannot exceed the property's maximum capacity.
- Rejection of invalid bookings with appropriate messages.

## Automated Testing 🧪

The project follows the **TDD (Test-Driven Development)** approach and includes:

- **Unit Tests:** Validate individual business rules.
- **Integration Tests:** Ensure that different parts of the system work together correctly.
- **End-to-End (E2E) Tests:** Simulate complete booking and cancellation flows.

### Running the Tests

To run all tests, use:

```sh
npm install
npm test
```

## How to Run the Project 🚀

1. Clone this repository:
   ```sh
   git clone https://github.com/Leandro-Lucena/booking-app.git
   ```
2. Access the project folder:
   ```sh
   cd booking-app
   ```
3. Install the dependencies:
   ```sh
   npm install
   ```
4. Run the tests:
   ```sh
   npm test
   ```

## Contributing 🤝

This project was created for educational purposes. Feel free to open **issues** and submit **pull requests** if you want to contribute with improvements!
