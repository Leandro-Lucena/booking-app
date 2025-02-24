import { DateRange } from "../../../domain/value_objects/date_range";
import { Booking } from "../../../domain/entities/booking";
import { Property } from "../../../domain/entities/property";
import { BookingEntity } from "../entities/booking_entity";
import { UserMapper } from "./user_mapper";
import { PropertyMapper } from "./property_mapper";

export class BookingMapper {
  static toDomain(entity: BookingEntity, property?: Property): Booking {
    if (!entity.id) {
      throw new Error("BookingEntity is missing the required 'id' field");
    }
    if (!entity.guest || !entity.guest.id || !entity.guest.name) {
      throw new Error("BookingEntity is missing the required 'guest' field");
    }
    if (!entity.guestCount || entity.guestCount <= 0) {
      throw new Error(
        "BookingEntity 'guestCount' field is required and must be greater than zero"
      );
    }

    const guest = UserMapper.toDomain(entity.guest);
    const dateRange = new DateRange(entity.startDate, entity.endDate);

    const booking = new Booking(
      entity.id,
      property || PropertyMapper.toDomain(entity.property),
      guest,
      dateRange,
      entity.guestCount
    );

    booking["totalPrice"] = Number(entity.totalPrice);
    booking["status"] = entity.status;

    return booking;
  }

  static toPersistence(domain: Booking): BookingEntity {
    const entity = new BookingEntity();
    entity.id = domain.getId();
    entity.property = PropertyMapper.toPersistence(domain.getProperty());
    entity.guest = UserMapper.toPersistence(domain.getGuest());
    entity.startDate = domain.getDateRange().getStartDate();
    entity.endDate = domain.getDateRange().getEndDate();
    entity.guestCount = domain.getGuestCount();
    entity.totalPrice = domain.getTotalPrice();
    entity.status = domain.getStatus();

    return entity;
  }
}
