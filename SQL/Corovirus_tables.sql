DROP TABLE time_series_coved19_confirmed
DROP TABLE global_population
DROP TABLE global_gdp
DROP TABLE Covid19_20200327

CREATE TABLE time_series_coved19_confirmed (

		country_region VARCHAR,
		province_state VARCHAR,
		latitude FLOAT,
		longitude FLOAT,
		date date,
		confirmed_case INT);
SELECT *
FROM time_series_coved19_confirmed;

CREATE TABLE global_population (
		country VARCHAR,
		population_2020 INT,
		med_age INT,
		world_share FLOAT);
		
SELECT *
FROM global_population;

CREATE TABLE global_gdp (
        country VARCHAR,
		gdp_2019_billions_usd FLOAT);
		
SELECT *
FROM global_gdp;

CREATE TABLE Covid19_20200327 (
		admin2 VARCHAR,
		province_state VARCHAR,
		country_region VARCHAR,
		fips FLOAT,
		latitude FLOAT,
		longitude FLOAT,
		date date,
		cases INT,
		death INT,
		source VARCHAR,
		update_date date
		);
SELECT *
FROM Covid19_20200327;




















