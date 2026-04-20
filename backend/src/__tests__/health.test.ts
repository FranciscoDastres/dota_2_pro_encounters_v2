import request from 'supertest'
import app from '../app'

describe('GET /api/health', () => {
  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({ status: 'ok' })
    expect(typeof res.body.timestamp).toBe('string')
  })
})

describe('GET /api/pro-encounters/:steamId', () => {
  it('returns 200 with the steamId echoed', async () => {
    const res = await request(app).get('/api/pro-encounters/12345678')
    expect(res.status).toBe(200)
    expect(res.body.steam_id).toBe('12345678')
  })
})
