import { neon } from "@neondatabase/serverless"
import * as fs from "fs"
import * as path from "path"

async function runMigration() {
  const connectionString = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL

  if (!connectionString) {
    console.error("[v0] Database connection string not configured")
    process.exit(1)
  }

  // Clean connection string
  const cleanConnectionString = connectionString.replace(/^psql\s+['"]?/, "").replace(/['"]$/, "")

  try {
    const sql = neon(cleanConnectionString)

    // Read migration files
    const migrationDir = path.join(__dirname)
    const migrationFiles = ["001_create_content_tables.sql", "002_add_top_movies_kdrama_tables.sql"]

    for (const file of migrationFiles) {
      const filePath = path.join(migrationDir, file)
      if (fs.existsSync(filePath)) {
        console.log(`[v0] Running migration: ${file}`)
        const sqlContent = fs.readFileSync(filePath, "utf-8")

        // Split by semicolon and execute each statement
        const statements = sqlContent.split(";").filter((stmt) => stmt.trim())

        for (const statement of statements) {
          if (statement.trim()) {
            try {
              await sql.query(statement)
              console.log(`[v0] ✓ Executed: ${statement.substring(0, 50)}...`)
            } catch (error: any) {
              // Ignore "already exists" errors
              if (!error.message?.includes("already exists")) {
                console.error(`[v0] Error executing statement:`, error.message)
              }
            }
          }
        }
      }
    }

    console.log("[v0] ✓ Migration completed successfully!")
    process.exit(0)
  } catch (error) {
    console.error("[v0] Migration failed:", error)
    process.exit(1)
  }
}

runMigration()
