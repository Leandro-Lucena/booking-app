import { RefundRuleFactory } from "../cancelation/refund_rule_factory";
import { DateRange } from "../value_objects/date_range";
import { Property } from "./property";
import { User } from "./user";

export class Booking {
  private readonly id: string;
  private readonly property: Property;
  private readonly user: User;
  private readonly dateRange: DateRange;
  private readonly guestCount: number;
  private status: "CONFIRMED" | "CANCELLED" = "CONFIRMED";
  private totalPrice: number;
  constructor(
    id: string,
    property: Property,
    user: User,
    dateRange: DateRange,
    guestCount: number
  ) {
    if (guestCount <= 0) {
      throw new Error("Number of guests must be greater than zero");
    }
    property.validateGuestCount(guestCount);
    if (!property.isAvailable(dateRange)) {
      throw new Error(
        "Cannot book property: it is unavailable for the selected dates"
      );
    }

    this.id = id;
    this.property = property;
    this.user = user;
    this.dateRange = dateRange;
    this.guestCount = guestCount;
    this.totalPrice = property.calculateTotalPrice(dateRange);
    this.status = "CONFIRMED";

    property.addBooking(this);
  }

  getId(): string {
    return this.id;
  }
  getProperty(): Property {
    return this.property;
  }
  getUser(): User {
    return this.user;
  }
  getDateRange(): DateRange {
    return this.dateRange;
  }
  getGuestCount(): number {
    return this.guestCount;
  }
  getStatus(): "CONFIRMED" | "CANCELLED" {
    return this.status;
  }
  getTotalPrice(): number {
    return this.totalPrice;
  }

  cancel(currentDate: Date): void {
    if (this.status == "CANCELLED") {
      throw new Error("Cannot cancel a booking which is already cancelled");
    }

    const checkInDate = this.dateRange.getStartDate();
    const timeDiff = checkInDate.getTime() - currentDate.getTime();
    const daysToCheckIn = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const refundRule = RefundRuleFactory.getRefundRule(daysToCheckIn);

    this.totalPrice = refundRule.calculateRefund(this.totalPrice);
    this.status = "CANCELLED";
  }
}
