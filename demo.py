from flask import Flask ,session, render_template, jsonify ,request,redirect,g,url_for
from werkzeug.utils import secure_filename
import json,re
from urllib.parse import quote
import requests

app = Flask(__name__)
app.secret_key = 'fosne naiodw dw nfeuk' 



CLIENT_ID = "c83713855a5748b2b8786ad8b8daff45"
CLIENT_SECRET = "85b994c355a94feaa8fefcf248fc60dc"

# Spotify URLS
SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize"
SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"
SPOTIFY_API_BASE_URL = "https://api.spotify.com"
API_VERSION = "v1"
SPOTIFY_API_URL = "{}/{}".format(SPOTIFY_API_BASE_URL, API_VERSION)

# Server-side Parameters
CLIENT_SIDE_URL = "https://spotify-dragdrop.herokuapp.com/"
PORT = 5000
REDIRECT_URI = "{}:{}/callback/".format(CLIENT_SIDE_URL, PORT)
SCOPE = "playlist-modify-public playlist-modify-private"
STATE = ""
SHOW_DIALOG_bool = True
SHOW_DIALOG_str = str(SHOW_DIALOG_bool).lower()

auth_query_parameters = {
    "response_type": "code",
    "redirect_uri": REDIRECT_URI,
    "scope": SCOPE,
    # "state": STATE,
    # "show_dialog": SHOW_DIALOG_str,
    "client_id": CLIENT_ID
}



@app.route('/',methods=['GET'])
def index():
   # Auth Step 1: Authorization
   url_args = "&".join(["{}={}".format(key, quote(val)) for key, val in auth_query_parameters.items()])
   auth_url = "{}/?{}".format(SPOTIFY_AUTH_URL, url_args)
   return redirect(auth_url)


@app.route('/dragdrop/',methods=['GET'])
def dragdrop():
	return render_template('demo.html')

@app.route('/refresh/',methods=['GET'])
def refresh():
    session['refresh']=True
    session['workspace']= request.args.get('workspace')
    session['url_link']=request.args.get('url_link')
    return redirect(url_for('index'))
	
@app.route('/callback/')
def callback():
    # Auth Step 4: Requests refresh and access tokens
    auth_token = request.args['code']
    code_payload = {
        "grant_type": "authorization_code",
        "code": str(auth_token),
        "redirect_uri": REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
    }
    post_request = requests.post(SPOTIFY_TOKEN_URL, data=code_payload)

    # Auth Step 5: Tokens are Returned to Application
    response_data = json.loads(post_request.text)
    access_token = response_data["access_token"]
    refresh_token = response_data["refresh_token"]
    token_type = response_data["token_type"]
    expires_in = response_data["expires_in"]

    # Auth Step 6: Use the access token to access Spotify API
    authorization_header = {"Authorization": "Bearer {}".format(access_token)}

    token = format(access_token)

   
    if 'refresh' in session:
        if session['refresh']==True:
            session['refresh']=False
            print(session['workspace'],'i')
            return redirect(url_for('dragdrop',                                      
                                    token = token
                                    ))  
 
    return redirect(url_for('dragdrop', token = token))

 

    #render_template("indexa.html", sorted_array=display_arr),files = files,sorted_array=display_arr,
 
if __name__ == '__main__':
 
    app.run(debug=True)
