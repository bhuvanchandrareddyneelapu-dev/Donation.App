package com.donationapp.config;

import org.flywaydb.core.Flyway;
import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;

@Configuration
public class FlywayConfig {

    @Bean
    public FlywayMigrationStrategy flywayMigrationStrategy(DataSource dataSource) {
        return flyway -> {
            try (Connection conn = dataSource.getConnection(); Statement stmt = conn.createStatement()) {
                try {
                    stmt.execute("DELETE FROM flyway_schema_history WHERE success = false");
                } catch (Exception ignored) {}

                try {
                    stmt.execute("ALTER TABLE donations ADD COLUMN IF NOT EXISTS gotram VARCHAR(255)");
                    stmt.execute("ALTER TABLE donations ADD COLUMN IF NOT EXISTS family_details VARCHAR(500)");
                    stmt.execute("ALTER TABLE donations ADD COLUMN IF NOT EXISTS public_visibility BOOLEAN DEFAULT TRUE");
                    stmt.execute("ALTER TABLE donations ADD COLUMN IF NOT EXISTS is_reversed BOOLEAN DEFAULT FALSE");
                    stmt.execute("ALTER TABLE donations ADD COLUMN IF NOT EXISTS reversed_by VARCHAR(255)");
                    stmt.execute("ALTER TABLE donations ADD COLUMN IF NOT EXISTS reversed_at TIMESTAMP");
                    stmt.execute("ALTER TABLE donations ADD COLUMN IF NOT EXISTS reversal_reason VARCHAR(500)");
                    stmt.execute("ALTER TABLE donations ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP");
                    stmt.execute("ALTER TABLE donations ADD COLUMN IF NOT EXISTS is_test BOOLEAN DEFAULT FALSE");

                    stmt.execute("CREATE TABLE IF NOT EXISTS donation_audit_log (" +
                        "id BIGSERIAL PRIMARY KEY, " +
                        "donation_id BIGINT NOT NULL, " +
                        "action VARCHAR(50) NOT NULL, " +
                        "old_amount NUMERIC(12,2), " +
                        "new_amount NUMERIC(12,2), " +
                        "reason VARCHAR(500), " +
                        "performed_by VARCHAR(255) NOT NULL, " +
                        "performed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)");

                    stmt.execute("DELETE FROM donations WHERE festival_id = 1 AND id = 1 AND donor_name = 'Priya Sundaram'");
                    stmt.execute("UPDATE festivals SET current_collection = 0.00, target_amount = 0.00 WHERE id = 1");
                } catch (Exception e) {
                    System.err.println("JDBC DDL notice: " + e.getMessage());
                }
            } catch (Exception e) {
                System.err.println("DataSource connection error in FlywayConfig: " + e.getMessage());
            }

            try {
                flyway.repair();
            } catch (Exception e) {
                System.err.println("Flyway repair notice: " + e.getMessage());
            }

            try {
                flyway.migrate();
            } catch (Exception e) {
                System.err.println("Flyway migrate notice: " + e.getMessage());
            }
        };
    }
}
