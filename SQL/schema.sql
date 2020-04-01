-- Note: edit folder path of the csv files before import
--       need to change folder permission for import

-- COVID 19 cases table
DROP TABLE covid19;
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

COPY covid19
FROM 'C:/Users/chanwc/Documents/NU_DS_HW/ClusterTestGH/Datasets/Covid19_20200329.csv'
DELIMITER ',' CSV HEADER;

SELECT *
FROM covid19;

-- Population table
DROP TABLE IF EXISTS global_population;
CREATE TABLE global_population (
	country VARCHAR,
	population_2020 INT,
	med_age INT,
	world_share FLOAT
);

COPY global_population
FROM 'C:/Users/chanwc/Documents/NU_DS_HW/ClusterTestGH/Datasets/global_population.output.csv'
DELIMITER ',' CSV HEADER;
		
SELECT *
FROM global_population;

-- GDP table
DROP TABLE IF EXISTS global_gdp;

CREATE TABLE global_gdp (
	country VARCHAR,
	gdp_2019_billions_usd FLOAT
);

COPY global_gdp
FROM 'C:/Users/chanwc/Documents/NU_DS_HW/ClusterTestGH/Datasets/global_gdp.output.csv'
DELIMITER ',' CSV HEADER;

SELECT *
FROM global_gdp;

-- health expenditure
DROP TABLE IF EXISTS health_exp_gdp;

CREATE TABLE health_exp_gdp (
	country VARCHAR,
	exp_pct_gdp_2016 FLOAT
);

COPY health_exp_gdp
FROM 'C:/Users/chanwc/Documents/NU_DS_HW/ClusterTestGH/Datasets/HeathExp.csv'
DELIMITER ',' CSV HEADER;

SELECT *
FROM health_exp_gdp;

-- links of country names from different tables
DROP TABLE IF EXISTS countries;
CREATE TABLE countries (
	code CHAR(2) PRIMARY KEY,
	iso_country VARCHAR,
	covid19_country VARCHAR,
	pop_country	VARCHAR,
	gdp_country	VARCHAR,
	hexp_country VARCHAR,
	latitude FLOAT,
	longitude FLOAT
);

COPY countries
FROM 'C:/Users/chanwc/Documents/NU_DS_HW/ClusterTestGH/Datasets/countries.csv'
DELIMITER ',' CSV HEADER;

SELECT *
FROM countries;














