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
    query = f'''SELECT * FROM covid19
        WHERE date = (SELECT MAX(date) FROM covid19)
        AND ((cases + death) > 0)
        AND NOT (latitude = 0 AND longitude = 0)
        '''
    df = pd.read_sql(query, connection)
    return df.to_json(orient='records')

#################################################
# Run the application
#################################################
if __name__ == '__main__':
    app.run(debug=True)
