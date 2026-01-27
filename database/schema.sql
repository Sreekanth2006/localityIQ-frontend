-- LocalityIQ Database Schema
-- PostgreSQL with PostGIS extension for geographic queries

-- Enable PostGIS extension (run as superuser)
-- CREATE EXTENSION IF NOT EXISTS postgis;

-- Localities table
CREATE TABLE localities (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    area VARCHAR(200) NOT NULL,
    city VARCHAR(100) DEFAULT 'Hyderabad',
    state VARCHAR(100) DEFAULT 'Telangana',
    coordinates POINT,
    -- coordinates GEOGRAPHY(POINT, 4326), -- Use this with PostGIS
    total_score INTEGER CHECK (total_score >= 0 AND total_score <= 100),
    recommendation VARCHAR(20) CHECK (recommendation IN ('buy', 'hold', 'avoid')),
    price_min INTEGER,
    price_max INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Locality metrics table
CREATE TABLE locality_metrics (
    id SERIAL PRIMARY KEY,
    locality_id VARCHAR(50) REFERENCES localities(id) ON DELETE CASCADE,
    metric_type VARCHAR(50) NOT NULL,
    score INTEGER CHECK (score >= 0 AND score <= 100),
    label VARCHAR(50),
    status VARCHAR(20) CHECK (status IN ('good', 'moderate', 'poor')),
    details TEXT,
    data_source VARCHAR(100),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(locality_id, metric_type)
);

-- Locality highlights table
CREATE TABLE locality_highlights (
    id SERIAL PRIMARY KEY,
    locality_id VARCHAR(50) REFERENCES localities(id) ON DELETE CASCADE,
    highlight TEXT NOT NULL,
    priority INTEGER DEFAULT 0
);

-- User reports table (for crowdsourced data)
CREATE TABLE user_reports (
    id SERIAL PRIMARY KEY,
    locality_id VARCHAR(50) REFERENCES localities(id),
    report_type VARCHAR(50) NOT NULL, -- water, power, safety, etc.
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified BOOLEAN DEFAULT FALSE
);

-- Price history table
CREATE TABLE price_history (
    id SERIAL PRIMARY KEY,
    locality_id VARCHAR(50) REFERENCES localities(id),
    price_per_sqft INTEGER,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Search logs table (for analytics)
CREATE TABLE search_logs (
    id SERIAL PRIMARY KEY,
    query VARCHAR(255),
    results_count INTEGER,
    searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_localities_city ON localities(city);
CREATE INDEX idx_localities_score ON localities(total_score DESC);
CREATE INDEX idx_metrics_locality ON locality_metrics(locality_id);
CREATE INDEX idx_metrics_type ON locality_metrics(metric_type);
CREATE INDEX idx_reports_locality ON user_reports(locality_id);
CREATE INDEX idx_price_history_locality ON price_history(locality_id);

-- Views for common queries

-- View: Locality summary with average user ratings
CREATE VIEW locality_summary AS
SELECT 
    l.id,
    l.name,
    l.area,
    l.total_score,
    l.recommendation,
    l.price_min,
    l.price_max,
    COUNT(DISTINCT ur.id) as total_reports,
    AVG(ur.rating) as avg_user_rating
FROM localities l
LEFT JOIN user_reports ur ON l.id = ur.locality_id
GROUP BY l.id, l.name, l.area, l.total_score, l.recommendation, l.price_min, l.price_max;

-- View: Top localities by score
CREATE VIEW top_localities AS
SELECT 
    id,
    name,
    area,
    total_score,
    recommendation
FROM localities
WHERE recommendation = 'buy'
ORDER BY total_score DESC
LIMIT 10;

-- Sample insert statements for Hyderabad localities
INSERT INTO localities (id, name, area, total_score, recommendation, price_min, price_max) VALUES
('kokapet', 'Kokapet', 'Financial District, Hyderabad', 82, 'buy', 8000, 12000),
('gachibowli', 'Gachibowli', 'IT Hub, Hyderabad', 78, 'buy', 7500, 11000),
('kondapur', 'Kondapur', 'Tech Corridor, Hyderabad', 75, 'hold', 6500, 9500),
('financial-district', 'Financial District', 'Nanakramguda, Hyderabad', 85, 'buy', 9000, 14000),
('hitech-city', 'Hitech City', 'Madhapur, Hyderabad', 76, 'hold', 8000, 12000),
('tellapur', 'Tellapur', 'West Hyderabad', 79, 'buy', 5500, 8000),
('nallagandla', 'Nallagandla', 'Serilingampally, Hyderabad', 74, 'hold', 5000, 7500);

-- Sample metrics insert
INSERT INTO locality_metrics (locality_id, metric_type, score, label, status, details) VALUES
('kokapet', 'airQuality', 72, 'Moderate', 'moderate', 'AQI around 80-100, improving with green zones'),
('kokapet', 'water', 65, 'Mixed', 'moderate', 'Municipal + borewell, some tanker dependence in summer'),
('kokapet', 'power', 85, 'Stable', 'good', 'TSSPDCL grid, avg 2-3 outages/month'),
('kokapet', 'schools', 88, 'Excellent', 'good', 'DPS, Oakridge, CHIREC within 5km'),
('kokapet', 'safety', 78, 'Good', 'good', 'Low crime rate, gated communities, police patrols'),
('kokapet', 'growth', 92, 'High Growth', 'good', 'Metro Phase 2, ORR proximity, IT corridor expansion'),
('kokapet', 'hospitals', 80, 'Good', 'good', 'Continental, KIMS within 8km'),
('kokapet', 'traffic', 70, 'Moderate', 'moderate', 'ORR access good, internal roads developing');

-- Sample highlights insert
INSERT INTO locality_highlights (locality_id, highlight, priority) VALUES
('kokapet', 'Metro Phase 2 planned', 1),
('kokapet', 'Near Financial District', 2),
('kokapet', 'Premium gated communities', 3);
