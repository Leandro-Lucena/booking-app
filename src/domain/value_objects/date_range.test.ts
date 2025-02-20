import { DateRange } from './date_range';
import { describe, expect, it } from '@jest/globals';

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

    it("Should verify if two date intervals overlap", () => {
        const dateRange1 = new DateRange(new Date('2024-12-20'), new Date('2024-12-25'));
        const dateRange2 = new DateRange(new Date('2024-12-22'), new Date('2024-12-27'));
        const overlaps = dateRange1.overlaps(dateRange2);

        expect(overlaps).toBe(true);
    });

    it("Should throw error if start date is equal to end date", () => {
        const date = new Date('2024-12-20');
        expect(() => {
            new DateRange(date, date);
        }).toThrow("Start date and end date must be different");
    });
});
