from flask import Flask, render_template
import os

app = Flask(__name__)


@app.route('/')
def index():
    return "\n".join(open("index.html").readlines())


if __name__ == '__main__':
    app.run(debug=True, port=os.getenv("PORT", default=8080))