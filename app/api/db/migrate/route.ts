import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function POST(request: Request) {
  try {
    const connectionString = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL

    if (!connectionString) {
      return NextResponse.json({ error: "Database connection not configured" }, { status: 500 })
    }

    // Clean connection string
    const cleanConnectionString = connectionString.replace(/^psql\s+['"]?/, "").replace(/['"]$/, "")
    const sql = neon(cleanConnectionString)

    // Create top_movies table
    await sql`
      CREATE TABLE IF NOT EXISTS top_movies (
        id SERIAL PRIMARY KEY,
        tmdb_id INTEGER NOT NULL UNIQUE,
        title VARCHAR(500) NOT NULL,
        poster_path VARCHAR(500),
        backdrop_path VARCHAR(500),
        overview TEXT,
        release_date VARCHAR(50),
        vote_average DECIMAL(3,1),
        vote_count INTEGER,
        rank INTEGER,
        download_link TEXT,
        download_title VARCHAR(500),
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create k_dramas table
    await sql`
      CREATE TABLE IF NOT EXISTS k_dramas (
        id SERIAL PRIMARY KEY,
        tmdb_id INTEGER NOT NULL UNIQUE,
        title VARCHAR(500) NOT NULL,
        poster_path VARCHAR(500),
        backdrop_path VARCHAR(500),
        overview TEXT,
        release_date VARCHAR(50),
        vote_average DECIMAL(3,1),
        vote_count INTEGER,
        genres JSONB,
        download_link TEXT,
        download_title VARCHAR(500),
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create genre_mapping table
    await sql`
      CREATE TABLE IF NOT EXISTS genre_mapping (
        id SERIAL PRIMARY KEY,
        content_id INTEGER NOT NULL,
        genre_id INTEGER NOT NULL,
        genre_name VARCHAR(100) NOT NULL,
        media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('movie', 'tv')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE
      )
    `

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_top_movies_rank ON top_movies(rank)`
    await sql`CREATE INDEX IF NOT EXISTS idx_k_dramas_vote_average ON k_dramas(vote_average DESC)`
    await sql`CREATE INDEX IF NOT EXISTS idx_genre_mapping_genre ON genre_mapping(genre_name)`
    await sql`CREATE INDEX IF NOT EXISTS idx_genre_mapping_media_type ON genre_mapping(media_type)`

    return NextResponse.json({
      success: true,
      message: "Database tables created successfully",
    })
  } catch (error: any) {
    console.error("[v0] Migration error:", error)
    return NextResponse.json(
      {
        error: "Migration failed",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
