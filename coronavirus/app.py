import os
from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
import pandas as pd

#################################################
# Flask Setup
#################################################

app = Flask(__name__)

#################################################
# Database Setup
#################################################

# app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:xxxxxx@localhost:5432/p2_coronavirus'
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', '')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

from . import models

#################################################
# Flask Routes
#################################################

# create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")

# Query all coronavirus data
# @app.route('/api/Covid19')
# def sendDataCovid19():
#     query = "SELECT * FROM covid19"
#     results = db.session.execute(query)
#     return {'covid19': [dict(zip(tuple(results.keys()), i)) for i in results.cursor]}

# Query latest coronavirus count, exclude zero data or data without coordinates
@app.route('/api/Covid19Latest')
def sendLatestCovid19():
    query = f'''SELECT admin2, province_state, country_region,
        date, cases, death, latitude, longitude
        FROM covid19
        WHERE date = (SELECT MAX(date) FROM covid19)
        AND ((cases + death) > 0)
        AND NOT (latitude = 0 AND longitude = 0)
        '''
    results = db.session.execute(query)
    return {'latest': [dict(zip(tuple(results.keys()), i)) for i in results.cursor]}

# Query Latest Covid-19 data along with country info for scatter plot
@app.route('/api/ScatterPlotLatest')
def mergeMetaData():
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
    results = db.session.execute(query)
    return {'countries': [dict(zip(tuple(results.keys()), i)) for i in results.cursor]}

#  query country data
@app.route('/api/Covid19ByCountry')
def queryCountryDaily():
    query = f'''
        SELECT country_region, date, cases, death
        FROM covid19 as c19
        WHERE admin2 IS NULL AND province_state IS NULL
    '''
    results = db.session.execute(query)
    return {'countries': [dict(zip(tuple(results.keys()), i)) for i in results.cursor]}

# Query Countries with no Reported Cases
@app.route('/api/NoCasesCountry')
def queryZeroCase():
    query = f'''
        SELECT c.code, c.iso_country, p.population_2020 as population, c.latitude, c.longitude
        FROM countries as c
        LEFT JOIN global_population as p
            on p.country = c.pop_country
        WHERE c.covid19_country IS NULL
        '''
    results = db.session.execute(query)
    return {'countries': [dict(zip(tuple(results.keys()), i)) for i in results.cursor]}

#  query states data
@app.route('/api/Covid19ByUSStates')
def queryStatesDaily():
    query = f'''
        SELECT province_state, date, cases, death
        FROM covid19
        WHERE admin2 IS NULL AND province_state IS NOT NULL AND country_region = 'US'
    '''
    results = db.session.execute(query)
    return {'states': [dict(zip(tuple(results.keys()), i)) for i in results.cursor]}

#################################################
# Run the application
#################################################
if __name__ == '__main__':
    app.run(debug=True)
