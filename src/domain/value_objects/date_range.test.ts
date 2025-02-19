import { DateRange } from './date_range';

describe('DateRange Value Objetc', () => {

    it("Should throw an error if end date is before start date", () => {
        expect(() => {
            new DateRange(new Date('2024-12-25'), new Date('2024-12-20'));
        }).toThrow("End date must be after start date");
    });

    it("Should create a new DateRange instance with start date and end date, and verify return values", () => {
        const startDate = new Date('2024-12-20');
        const endDate = new Date('2024-12-25');
        const dateRange = new DateRange(startDate, endDate);
        expect(dateRange.getStartDate()).toEqual(startDate);
        expect(dateRange.getEndDate()).toEqual(endDate);
    });

    it("Should calculate total nights between start date and end date", () => {
        const startDate = new Date('2024-12-20');
        const endDate = new Date('2024-12-25');
        const dateRange = new DateRange(startDate, endDate);
        const totalNights = dateRange.getTotalNights();

        expect(totalNights).toBe(5);

        const startDate2 = new Date('2024-12-10');
        const endDate2 = new Date('2024-12-25');
        const dateRange2 = new DateRange(startDate2, endDate2);
        const totalNights2 = dateRange2.getTotalNights();

        expect(totalNights2).toBe(15);
    });
});
