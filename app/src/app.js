var constants = require('./constants.js');
var SpotifyWebApi = require('spotify-web-api-node');

/****************** Constants *******************/

// Audio Features
const AUDIO_FEATURE_ACOUSTICNESS = 'acousticness';
const AUDIO_FEATURE_DANCEABILITY = 'danceability';
const AUDIO_FEATURE_ENERGY = 'energy';
const AUDIO_FEATURE_TEMPO = 'tempo';
const AUDIO_FEATURE_VALENCE = 'valence';

// Seed Track Fields
const SEED_TRACK_ALBUM = 'album';
const SEED_TRACK_ARTISTS = 'artists';
const SEED_TRACK_NAME = 'name';
const SEED_TRACK_ID = 'id';

// InitialJukeboxState member fields
const SEED_TRACKS = 'seed-tracks';
const DEFAULT_PARAMS = 'default-params';

/************** Exported Routines ****************/

/*
 * Returns a promise containing an object of format
 * {SEED_TRACKS: [], DEFAULT_PARAMS: {}}
 */
function getInitialJukeboxState(accessToken) {
  return getTopTracks(accessToken)
    .then(function(topTracksObj) {
      seedTracks = getSeedTracks(topTracksObj);
      tracksIds = extractTracksIds(topTracksObj);
      return getAudioFeatures(accessToken, tracksIds)
        .then(function(tracksFeatures) {
          defaultParams = getDefaultJukeboxParams(tracksFeatures);
          return {
            SEED_TRACKS : seedTracks,
            DEFAULT_PARAMS : defaultParams 
          };
        }, errorHandler);
    }, errorHandler);
}

/************** Spotify API Wrappers ****************/

/*
 * Returns a promise containing json-encoded list of user's top tracks
 */
function getTopTracks(accessToken) {
  // Instatiate api instance and set its accessToken
  var spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(accessToken);

  // Return top tracks wrapped in a promise
  return spotifyApi.getMyTopTracks();
}

/*
 * Returns a promise containing json-encoded set of features for 
 * every track in trackIds
 */
function getAudioFeatures(accessToken, trackIds) {
  // Instatiate api instance and set its accessToken
  var spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(accessToken);

  // Return audio features wrapped in a promise
  return spotifyApi.getAudioFeaturesForTracks(trackIds);
}

/****************** Helpers ********************/

/*
 * Returns ids of all tracks in a TopTracks Object
 */
function extractTracksIds(topTracksObj) {
  return topTracksObj.body.items.map(function(track) {
    return track.id;
  }); 
}

/*
 * Returns a promise containing default Jukebox parameters
 */
function getDefaultJukeboxParams(tracksFeatures) {
  features = {
    [AUDIO_FEATURE_ACOUSTICNESS] : 0,
    [AUDIO_FEATURE_DANCEABILITY] : 0,
    [AUDIO_FEATURE_ENERGY] : 0,
    [AUDIO_FEATURE_TEMPO] : 0,
    [AUDIO_FEATURE_VALENCE] : 0
  };

  var numTracks = tracksFeatures.body.audio_features.length;

  // Aggregate every feature for every track
  tracksFeatures.body.audio_features.forEach(function(trackFeatures) {
    Object.keys(features).forEach(function(feature) {
      features[feature] += trackFeatures[feature];
    });   
  });

  // Take simple average of all features
  Object.keys(features).forEach(function(feature) {
    features[feature] = features[feature] / numTracks;  
  });

  return features;
}

/*
 * Returns a promise containing select fields of potential seed tracks
 */
function getSeedTracks(topTracksObj) {
  seedTracks = [];
  fields = {
    [SEED_TRACK_ALBUM]: null,
    [SEED_TRACK_ARTISTS]: [],
    [SEED_TRACK_NAME]: null,
    [SEED_TRACK_ID]: null,
  };
  
  // Record select fields of each track in seedTracks
  topTracksObj.body.items.forEach(function(track){
    protoTrack = {};
    Object.keys(fields).forEach(function(field) {
      protoTrack[field] = track[field];
    });
    seedTracks.push(protoTrack);
  });

  return seedTracks;
}

/*
 * Generic error handler - should not be used in prod
 */
function errorHandler(err) {
  console.log(err);
}

/******************** Main Routines ********************/

module.exports = {
  getInitialJukeboxState: getInitialJukeboxState
};

/*
 * Example usage of getInitialJukeboxState()
 */
function main() {
  accessToken = ''; 
  getInitialJukeboxState(accessToken).then(function(initialState){
    console.log(initialState);
  }, errorHandler);
}

if (require.main === module) {
  main();
}

