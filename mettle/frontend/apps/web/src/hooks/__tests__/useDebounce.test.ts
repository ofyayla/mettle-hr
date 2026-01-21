import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should return initial value immediately', () => {
        const { result } = renderHook(() => useDebounce('test', 500));
        expect(result.current).toBe('test');
    });

    it('should debounce value changes', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            { initialProps: { value: 'initial', delay: 500 } }
        );

        expect(result.current).toBe('initial');

        // Change the value
        rerender({ value: 'updated', delay: 500 });

        // Value should not have changed yet
        expect(result.current).toBe('initial');

        // Fast forward time
        act(() => {
            vi.advanceTimersByTime(500);
        });

        // Now it should be updated
        expect(result.current).toBe('updated');
    });

    it('should cancel previous timeout on rapid changes', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            { initialProps: { value: 'a', delay: 500 } }
        );

        rerender({ value: 'b', delay: 500 });
        act(() => {
            vi.advanceTimersByTime(200);
        });

        rerender({ value: 'c', delay: 500 });
        act(() => {
            vi.advanceTimersByTime(200);
        });

        // Still showing 'a' because debounce hasn't completed
        expect(result.current).toBe('a');

        act(() => {
            vi.advanceTimersByTime(500);
        });

        // Should show final value 'c', not 'b'
        expect(result.current).toBe('c');
    });
});
