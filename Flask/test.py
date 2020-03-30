from flask import Flask, jsonify, render_template, request

import datetime as dt
import numpy as np
import pandas as pd

import sqlalchemy
from sqlalchemy import create_engine, func
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
import json

#################################################
# Database Setup
#################################################
# engine = create_engine("sqlite:///hawaii.sqlite")
engine = create_engine(f'postgres://postgres:2882776mumu@localhost/Coronavirus')

conn = engine.connect()


# data_1.head()
# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save references to each table
# Aaa = Base.classes.time_series_coved19_confirmed
# Station = Base.classes.station

# Create session
session = Session(engine)

#################################################
# Flask Setup
#################################################

app = Flask(__name__)

#################################################
# Flask Routes
#################################################

@app.route("/")
def Home():
    data_1 = pd.read_sql("SELECT country_region from time_series_coved19_confirmed", conn)
    data_2 = data_1.to_json()

    return jsonify(data_2)


# def calc_temps(start_date, end_date):
#     """TMIN, TAVG, and TMAX for a list of dates.
    
#     Args:
#         start_date (string): A date string in the format %Y-%m-%d
#         end_date (string): A date string in the format %Y-%m-%d
        
#     Returns:
#         TMIN, TAVE, and TMAX
#     """
#     session = Session(engine)

#     return (
#         session.query(
#             func.min(Measurement.tobs),
#             func.avg(Measurement.tobs),
#             func.max(Measurement.tobs),
#         )
#         .filter(Measurement.date >= start_date)
#         .filter(Measurement.date <= end_date)
#         .all()
#     )


# # Calculate the date 1 year ago from the last data point in the database
# last_date = session.query(Measurement.date).order_by(Measurement.date.desc()).first()[0]
# last_date = dt.datetime.strptime(last_date, "%Y-%m-%d")
# last_year = last_date - dt.timedelta(days=365)



# #################################################
# @app.route("/api/v1.0/precipitation")
# def precipitation():
#     # Create our session (link) from Python to the DB
#     session = Session(engine)

#     # Perform a query to retrieve the data and precipitation scores
#     precipitation = session.query(Measurement.date, Measurement.prcp).\
#         filter(Measurement.date >= '2016-08-22').order_by(Measurement.date).all()

#     precipitation_df = pd. DataFrame(precipitation, columns = ['date', 'prcp'])
 
#     # Convert the query results to a Dictionary using `date` as the key and `prcp` as the value.
#     precipitation__dict = dict(precipitation_df)

#     session.close()

#     return jsonify(precipitation__dict)

# #################################################
# @app.route("/api/v1.0/stations")
# def stations():
#     # Create our session (link) from Python to the DB
#     session = Session(engine)

#     # Query all passengers
#     results = session.query(Stations.station, Stations.name).all()

#     session.close()

#     # Create a dictionary from the row data and append to a list of all_passengers
#     all_station = []
#     for station, name in results:
#         station_dict = {}
#         station_dict["station"] = station
#         station_dict["name"] = name
#         all_station.append(station_dict)

#     return jsonify(all_station)

# #################################################
# @app.route("/api/v1.0/tobs")
# def tobs():
#     # Create our session (link) from Python to the DB
#     session = Session(engine)

#     # query for the dates and temperature observations from a year from the last data point.
#     results = session.query(Measurement.date,Measurement.tobs).\
#         filter(Measurement.date >= '2016-08-17').all()
    
#     session.close()

#     # Create a dictionary from the row data and append to a list of all_passengers
#     all_tobs = []
#     for date, tob in results:
#         tob_dict = {}
#         tob_dict["date"] = date
#         tob_dict["tobs"] = tobs
#         all_tobs.append(tob_dict)

#     return jsonify(all_tobs)

# #################################################    
# @app.route("/api/v1.0/<start>")
# def start(start):
#     """Returns the JSON list of the minimum, average and the maximum temperatures for a given start date (YYYY-MM-DD)"""

#     temps = calc_temps(start, last_date)

#     # Create a list to store the temperature records
#     temp_list = []
#     date_dict = {"Start Date": start, "End Date": last_date}
#     temp_list.append(date_dict)
#     temp_list.append(
#         {"Observation": "Minimum Temperature", "Temperature(F)": temps[0][0]}
#     )
#     temp_list.append(
#         {"Observation": "Average Temperature", "Temperature(F)": temps[0][1]}
#     )
#     temp_list.append(
#         {"Observation": "Maximum Temperature", "Temperature(F)": temps[0][2]}
#     )

#     return jsonify(temp_list)



# #################################################
# @app.route("/api/v1.0")
# def start_end():
#     """Returns the JSON list of the minimum, average and the maximum temperatures for a given start date and end date(YYYY-MM-DD)"""
#     start = request.args.get("Start Date")
#     end = request.args.get("End Date")


#     temps = calc_temps(start, end)
#     # Create a list to store the temperature records
#     temp_list = []
#     date_dict = {"Start Date": start, "End Date": end}
#     temp_list.append(date_dict)
#     temp_list.append(
#         {"Observation": "Minimum Temperature", "Temperature(F)": temps[0][0]}
#     )
#     temp_list.append(
#         {"Observation": "Average Temperature", "Temperature(F)": temps[0][1]}
#     )
#     temp_list.append(
#         {"Observation": "Maximum Temperature", "Temperature(F)": temps[0][2]}
#     )
#     return jsonify(temp_list)


#################################################
# Run the application
#################################################
if __name__ == '__main__':
    app.run(debug=True)
