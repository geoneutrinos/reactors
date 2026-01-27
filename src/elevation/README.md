Elevation Model
===========
This module has the lookup table for the ellipsoidal elevation data. The elevation datum is the smooth ellipsoidal surface defined by WGS84. Therefore, ellipsoidal elevations are required for fixing the positions of detection sites and reactor cores. These positions are the inputs for useful calculations of the detected rates and energy spectra of the various neutrino interactions.

Files
-----
* index.ts - the typescript code which the web app uses
* index.test.js (not here see src/crust-model/index.test.js) - tests to ensure that the index.ts is extracting the expected cells
* Earth_Ellipsoide_Height.xlsx - Original Data
* ellipsoid_height_to_json.py - generates the json documents for the various heights
* elevation_{o|g|e}.json - files made by the above python script containing the ortho, geoid, ellip data for the columns we want
