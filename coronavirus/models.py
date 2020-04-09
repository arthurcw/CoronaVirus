from .app import db
from datetime import datetime

class Countries(db.Model):
    __tablename__ = 'countries'

    code = db.Column(db.String(2), primary_key=True)
    iso_country = db.Column(db.String)
    covid19_country = db.Column(db.String)
    pop_country	= db.Column(db.String)
    gdp_country	= db.Column(db.String)
    hexp_country = db.Column(db.String)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)

    def __repr__(self):
        return '<Countries {}>' % (self.name)

class Covid19(db.Model):
    __tablename__ = 'covid19'

    id = db.Column(db.Integer, primary_key=True)
    admin2 = db.Column(db.String)
    province_state = db.Column(db.String)
    country_region = db.Column(db.String, nullable=False)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    date = db.Column(db.DateTime)
    cases = db.Column(db.Integer)
    death = db.Column(db.Integer)

    def __repr__(self):
        return '<Covid19 {}>' % (self.name)

class Global_gdp(db.Model):
    __tablename__ = 'global_gdp'

    country = db.Column(db.String, primary_key=True)
    gdp_2019_billions_usd = db.Column(db.Float)

    def __repr__(self):
        return '<Global_gdp {}>' % (self.name)

class Global_population(db.Model):
    __tablename__ = 'global_population'

    country = db.Column(db.String, primary_key=True)
    population_2020 = db.Column(db.Integer)
    med_age = db.Column(db.Integer)
    world_share = db.Column(db.Float)

    def __repr__(self):
        return '<Global_population {}>' % (self.name)

class Health_exp_gdp(db.Model):
    __tablename__ = 'health_exp_gdp'

    country = db.Column(db.String, primary_key=True)
    exp_pct_gdp_2016 = db.Column(db.Float)

    def __repr__(self):
        return '<Health_exp_gdp {}>' % (self.name)
