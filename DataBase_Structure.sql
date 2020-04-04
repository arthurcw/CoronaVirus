-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/d/1Il6HK
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.


-- Modify this code to update the DB schema diagram.
-- To reset the sample schema, replace everything with
-- two dots ('..' - without quotes).
CREATE TABLE countries (
    code VARCHAR   NOT NULL,
    country VARCHAR   NOT NULL,
    covid19_country VARCHAR   NOT NULL,
    pop_country VARCHAR   NOT NULL,
    gdp_country VARCHAR   NOT NULL,
    hexp_country VARCHAR   NOT NULL,
    latitude FLOAT   NOT NULL,
    longitude FLOAT   NOT NULL,
    CONSTRAINT pk_countries PRIMARY KEY (
        country
     )
);

CREATE TABLE covid19 (
    admin2 VARCHAR(50),   NOT NULL,
    province_state VARCHAR(50),   NOT NULL,
    country VARCHAR   NOT NULL,
    fips FLOAT,   NOT NULL,
    latitude FLOAT,   NOT NULL,
    longitude FLOAT,   NOT NULL,
    date date,   NOT NULL,
    cases INT,   NOT NULL,
    death INT,   NOT NULL,
    source VARCHAR(50),   NOT NULL,
    update_date date   NOT NULL
);

CREATE TABLE global_population (
    country VARCHAR   NOT NULL,
    population_2020 INT,   NOT NULL,
    med_age INT,   NOT NULL,
    world_share FLOAT   NOT NULL
);

CREATE TABLE global_gdp (
    country VARCHAR   NOT NULL,
    gdp_2019_billions_usd FLOAT   NOT NULL
);

CREATE TABLE health_exp_gdp (
    country VARCHAR   NOT NULL,
    exp_pct_gdp_2016 FLOAT   NOT NULL
);

ALTER TABLE covid19 ADD CONSTRAINT fk_covid19_country FOREIGN KEY(country)
REFERENCES countries (country);

ALTER TABLE global_population ADD CONSTRAINT fk_global_population_country FOREIGN KEY(country)
REFERENCES countries (country);

ALTER TABLE global_gdp ADD CONSTRAINT fk_global_gdp_country FOREIGN KEY(country)
REFERENCES countries (country);

ALTER TABLE health_exp_gdp ADD CONSTRAINT fk_health_exp_gdp_country FOREIGN KEY(country)
REFERENCES countries (country);

