import { describe, it, expect } from 'vitest'
import { getFeedback, feedback } from '../src/data/ancestorFeedback'

describe('getFeedback', () => {
  it('returns perfect tier for 100%', () => {
    const result = getFeedback(100)
    expect(result.tier).toBe('perfect')
  })

  it('returns okay tier for 60–99%', () => {
    expect(getFeedback(60).tier).toBe('okay')
    expect(getFeedback(80).tier).toBe('okay')
    expect(getFeedback(99).tier).toBe('okay')
  })

  it('returns wth tier for below 60%', () => {
    expect(getFeedback(0).tier).toBe('wth')
    expect(getFeedback(59).tier).toBe('wth')
  })

  it('returns a message string', () => {
    const result = getFeedback(100)
    expect(typeof result.message).toBe('string')
    expect(result.message.length).toBeGreaterThan(0)
  })

  it('message comes from the correct tier pool', () => {
    const result = getFeedback(100)
    expect(feedback.perfect).toContain(result.message)
  })
})
