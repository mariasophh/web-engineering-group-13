import sys
import flask
import json
from flask_cors import CORS

app = flask.Flask(__name__)

# cors
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# test route
@app.route('/')
def Hello():
    return "Hello world!"

if __name__ == "__main__":
    app.run()

