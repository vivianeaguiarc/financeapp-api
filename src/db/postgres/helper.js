import 'dotenv/config'
import pg from 'pg'

const { Pool } = pg

export const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: Number(process.env.POSTGRES_PORT) || 5432,
})

export const PostgresHelper = {
    query: async (query, params) => {
        const client = await pool.connect()
        const results = await client.query(query, params)
        await client.release()
        return results.rows
    },
}
