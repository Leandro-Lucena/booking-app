import { DateRange } from "../value_objects/date_range";
import { Booking } from "./booking";

export class Property {
  private readonly bookings: Booking[] = [];
  constructor(
    private id: string,
    private name: string,
    private description: string,
    private maxGuests: number,
    private basePricePerNight: number
  ) {
    if (!name) {
      throw new Error("Property name is required");
    }
    if (maxGuests <= 0) {
      throw new Error("Property max guests must be greater than zero");
    }
    this.id = id;
    this.name = name;
    this.description = description;
    this.maxGuests = maxGuests;
    this.basePricePerNight = basePricePerNight;
  }

  getId(): string {
    return this.id;
  }
  getName(): string {
    return this.name;
  }
  getDescription(): string {
    return this.description;
  }
  getMaxGuests(): number {
    return this.maxGuests;
  }
  getBasePricePerNight(): number {
    return this.basePricePerNight;
  }

  validateGuestCount(guestCount: number): void {
    if (guestCount > this.maxGuests) {
      throw new Error(
        `Property can't accommodate more than ${this.maxGuests} guests`
      );
    }
  }

  calculateTotalPrice(dateRange: DateRange): number {
    const totalNights = dateRange.getTotalNights();
    let totalPrice = totalNights * this.basePricePerNight;
    if (totalNights >= 7) {
      totalPrice *= 0.9;
    }
    return totalPrice;
  }
  isAvailable(dateRange: DateRange): boolean {
    return !this.bookings.some(
      (booking) =>
        booking.getStatus() === "CONFIRMED" &&
        booking.getDateRange().overlaps(dateRange)
    );
  }
  addBooking(booking: Booking): void {
    this.bookings.push(booking);
  }
}
