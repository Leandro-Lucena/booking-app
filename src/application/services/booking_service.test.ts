import { FakeBookingRespository } from "../../infrastructure/repositories/fake_booking_repository";
import { Booking } from "../../domain/entities/booking";
import { CreateBookingDTO } from "../dtos/create_booking_dto";
import { PropertyService } from "./property_service";
import { UserService } from "./user_service";
import { BookingService } from "./booking_service";

jest.mock("./property_service");
jest.mock("./user_service");

describe("BookingService", () => {
  let bookingService: BookingService;
  let fakeBookingRepository: FakeBookingRespository;
  let mockPropertyService: jest.Mocked<PropertyService>;
  let mockUserService: jest.Mocked<UserService>;

  beforeEach(() => {
    const mockPropertyRespository = {} as any;
    const mockUserRespository = {} as any;

    mockPropertyService = new PropertyService(
      mockPropertyRespository
    ) as jest.Mocked<PropertyService>;

    mockUserService = new UserService(
      mockUserRespository
    ) as jest.Mocked<UserService>;

    fakeBookingRepository = new FakeBookingRespository();

    bookingService = new BookingService(
      fakeBookingRepository,
      mockPropertyService,
      mockUserService
    );
  });

  it("Should create a booking using fake repository", async () => {
    const mockProperty = {
      getId: jest.fn().mockReturnValue("1"),
      isAvailable: jest.fn().mockReturnValue(true),
      validateGuestCount: jest.fn(),
      calculateTotalPrice: jest.fn().mockReturnValue(500),
      addBooking: jest.fn(),
    } as any;

    const mockUser = {
      getId: jest.fn().mockReturnValue("1"),
    } as any;

    mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);
    mockUserService.findUserById.mockResolvedValue(mockUser);

    const bookingDTO: CreateBookingDTO = {
      propertyId: "1",
      guestId: "1",
      startDate: new Date("2025-12-20"),
      endDate: new Date("2025-12-25"),
      guestCount: 2,
    };

    const result = await bookingService.createBooking(bookingDTO);

    expect(result).toBeInstanceOf(Booking);
    expect(result.getStatus()).toBe("CONFIRMED");
    expect(result.getTotalPrice()).toBe(500);

    const savedBooking = await fakeBookingRepository.findById(result.getId());
    expect(savedBooking).not.toBeNull();
    expect(savedBooking?.getId()).toBe(result.getId());
  });

  it("Should throw an error if the property is not found", async () => {
    mockPropertyService.findPropertyById.mockResolvedValue(null);

    const bookingDTO: CreateBookingDTO = {
      propertyId: "1",
      guestId: "1",
      startDate: new Date("2025-12-20"),
      endDate: new Date("2025-12-25"),
      guestCount: 2,
    };

    await expect(bookingService.createBooking(bookingDTO)).rejects.toThrowError(
      "Property not found"
    );
  });
  it("Should throw an error if the user is not found", async () => {
    const mockProperty = {
      getId: jest.fn().mockReturnValue("1"),
    } as any;

    mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);
    mockUserService.findUserById.mockResolvedValue(null);

    const bookingDTO: CreateBookingDTO = {
      propertyId: "1",
      guestId: "1",
      startDate: new Date("2025-12-20"),
      endDate: new Date("2025-12-25"),
      guestCount: 2,
    };

    await expect(bookingService.createBooking(bookingDTO)).rejects.toThrowError(
      "Guest not found"
    );
  });

  it("Should throw an error if try to create a booking with a date range already reserved", async () => {
    const mockProperty = {
      getId: jest.fn().mockReturnValue("1"),
      isAvailable: jest.fn().mockReturnValue(true),
      validateGuestCount: jest.fn(),
      calculateTotalPrice: jest.fn().mockReturnValue(500),
      addBooking: jest.fn(),
    } as any;

    const mockUser = {
      getId: jest.fn().mockReturnValue("1"),
    } as any;

    mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);
    mockUserService.findUserById.mockResolvedValue(mockUser);

    const bookingDTO: CreateBookingDTO = {
      propertyId: "1",
      guestId: "1",
      startDate: new Date("2025-12-20"),
      endDate: new Date("2025-12-25"),
      guestCount: 2,
    };

    await bookingService.createBooking(bookingDTO);

    mockProperty.isAvailable.mockReturnValue(false);
    mockProperty.addBooking.mockImplementationOnce(() => {
      throw new Error(
        "Cannot book property: it is unavailable for the selected dates"
      );
    });
    await expect(bookingService.createBooking(bookingDTO)).rejects.toThrow(
      "Cannot book property: it is unavailable for the selected dates"
    );
  });
  it("Should cancel a booking using fake repository", async () => {
    const mockProperty = {
      getId: jest.fn().mockReturnValue("1"),
      isAvailable: jest.fn().mockReturnValue(true),
      validateGuestCount: jest.fn(),
      calculateTotalPrice: jest.fn().mockReturnValue(500),
      addBooking: jest.fn(),
    } as any;

    const mockUser = {
      getId: jest.fn().mockReturnValue("1"),
    } as any;

    mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);
    mockUserService.findUserById.mockResolvedValue(mockUser);

    const bookingDTO: CreateBookingDTO = {
      propertyId: "1",
      guestId: "1",
      startDate: new Date("2025-12-20"),
      endDate: new Date("2025-12-25"),
      guestCount: 2,
    };

    const booking = await bookingService.createBooking(bookingDTO);

    const spyFindById = jest.spyOn(fakeBookingRepository, "findById");

    await bookingService.cancelBooking(booking.getId());
    const canceledBooking = await fakeBookingRepository.findById(
      booking.getId()
    );
    expect(canceledBooking?.getStatus()).toBe("CANCELLED");
    expect(spyFindById).toHaveBeenCalledWith(booking.getId());
    expect(spyFindById).toHaveBeenCalledTimes(2);
    spyFindById.mockRestore();
  });
});
