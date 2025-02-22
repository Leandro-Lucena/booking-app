import { Booking } from "../../domain/entities/booking";
import { BookingRepository } from "../../domain/repositories/booking_repository";

export class FakeBookingRespository implements BookingRepository {
  private bookings: Booking[] = [];

  async save(booking: Booking): Promise<void> {
    this.bookings.push(booking);
  }
  async findById(id: string): Promise<Booking | null> {
    return this.bookings.find((booking) => booking.getId() === id) || null;
  }
}
