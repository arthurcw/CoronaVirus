-- Drop tables if exist
DROP TABLE global_population
DROP TABLE global_gdp
DROP TABLE covid19

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

CREATE TABLE covid19 (
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
FROM covid19;

COPY covid19
FROM 'C:/Users/chanwc/Documents/NU_DS_HW/ClusterTestGH/Datasets/Covid19_20200329.csv'
DELIMITER ',' CSV HEADER;



















