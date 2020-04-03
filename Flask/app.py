import psycopg2
import sys
from flask import Flask, jsonify, render_template
from sqlalchemy import create_engine
import pandas as pd

# postgres login credentials and DB location
from sql_config import pw
from sql_config import user
db_loc = 'localhost:5432'
db_name = 'p2_coronavirus'

#################################################
# Flask Setup
#################################################

app = Flask(__name__)

#################################################
# Flask Routes
#################################################

# Query all coronavirus data
@app.route('/dataCovid19')
def sendDataCovid19():
    engine = create_engine(f"postgresql+psycopg2://{user}:{pw}@{db_loc}/{db_name}")
    connection = engine.connect()
    df_covid19 = pd.read_sql("SELECT * FROM covid19", connection)
    return df_covid19.to_json(orient='records')

# Query latest coronavirus count, exclude zero data or data without coordinates
@app.route('/dataCovid19Latest')
def sendLatestCovid19():
    engine = create_engine(f"postgresql+psycopg2://{user}:{pw}@{db_loc}/{db_name}")
    connection = engine.connect()
    query = f'''SELECT admin2, province_state, country_region,
        date, cases, death, latitude, longitude
        FROM covid19
        WHERE date = (SELECT MAX(date) FROM covid19)
        AND ((cases + death) > 0)
        AND NOT (latitude = 0 AND longitude = 0)
        '''
    df = pd.read_sql(query, connection)
    return df.to_json(orient='records')

# Query Latest Covid-19 data along with country info for scatter plot
@app.route('/dataLatestInfo')
def mergeMetaData():
    engine = create_engine(f"postgresql+psycopg2://{user}:{pw}@{db_loc}/{db_name}")
    connection = engine.connect()
    query = f'''
        SELECT c.code,
            c19.country_region, c19.date, c19.cases, c19.death,
            p.population_2020 as population, p.med_age,
            g.gdp_2019_billions_usd*1e9/p.population_2020 as gdp,
            h.exp_pct_gdp_2016 as health_exp
        FROM covid19 as c19
        LEFT JOIN countries as c
            ON c19.country_region = c.covid19_country
        LEFT JOIN global_population as p
            on p.country = c.pop_country
        LEFT JOIN global_gdp as g
            on g.country = c.gdp_country
        LEFT JOIN health_exp_gdp as h
            on h.country = c.hexp_country
        WHERE c19.date = (SELECT MAX(date) FROM covid19)
        AND ((c19.cases + c19.death) > 0)
        AND c19.admin2 IS NULL
        AND c19.province_state IS NULL
        '''
    df = pd.read_sql(query, connection)
    return df.to_json(orient='records')

# Query Countries with no Reported Cases
@app.route('/countryNoCase')
def queryZeroCase():
    engine = create_engine(f"postgresql+psycopg2://{user}:{pw}@{db_loc}/{db_name}")
    connection = engine.connect()
    query = f'''
        SELECT code, iso_country, latitude, longitude
        FROM countries
        WHERE covid19_country IS NULL
        '''
    df = pd.read_sql(query, connection)
    return df.to_json(orient='records')

#################################################
# Run the application
#################################################
if __name__ == '__main__':
    app.run(debug=True)
