import { renderHook, act } from '@testing-library/react'
import useDebounce from '../../hooks/useDebounce'

jest.useFakeTimers()

describe('useDebounce', () => {
  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 400))
    expect(result.current).toBe('hello')
  })

  it('should not update immediately on value change', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 400), {
      initialProps: { value: 'hello' },
    })
    rerender({ value: 'world' })
    expect(result.current).toBe('hello') // not yet updated
  })

  it('should update after delay', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 400), {
      initialProps: { value: 'hello' },
    })
    rerender({ value: 'world' })
    act(() => { jest.advanceTimersByTime(400) })
    expect(result.current).toBe('world')
  })
})
