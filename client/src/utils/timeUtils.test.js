import { calculateDuration, calculateDurationMinutes } from './timeUtils';

describe('Time Utilities', () => {
    test('calculateDuration correctly calculates same-day duration', () => {
        // 10:00 -> 12:00 = 2h
        expect(calculateDuration("10:00", "12:00")).toBe("2h 0m");
    });

    test('calculateDuration correctly calculates overnight duration', () => {
        // 23:00 -> 07:00 = 8h
        // 23 to 24 = 1h, 0 to 7 = 7h. Total 8h.
        expect(calculateDuration("23:00", "07:00")).toBe("8h 0m");
    });

    test('calculateDuration handles partial hours', () => {
        // 23:30 -> 07:15 = 7h 45m
        expect(calculateDuration("23:30", "07:15")).toBe("7h 45m");
    });

    test('calculateDurationMinutes returns correct minutes', () => {
        expect(calculateDurationMinutes("23:00", "07:00")).toBe(480); // 8 * 60
        expect(calculateDurationMinutes("12:00", "12:30")).toBe(30);
    });

    test('calculateDuration handles invalid inputs gracefully', () => {
        expect(calculateDuration("invalid", "12:00")).toBe("");
    });
});
