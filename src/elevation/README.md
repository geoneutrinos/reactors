Elevation Model
===========
This module has the lookup table for the ellipsoidal elevation data. The elevation datum is the smooth ellipsoidal surface defined by WGS84. Therefore, ellipsoidal elevations fix the positions of detection sites and reactor cores. These positions accurately determine the source-point to field-point distances. Accurate distances are the needed inputs for useful calculations of the rates and energy spectra for the various neutrino interactions.

Files
-----
* index.ts - the typescript code, which the web app uses
* index.test.js (is not in this folder; see src/crust-model/index.test.js) - tests to ensure that the index.ts is extracting the expected cells
* Earth_Ellipsoide_Height.xlsx - gridded data averaged over 1x1 degrees for orthometric (m.s.l. datum) heights from CRUST1.0, geoid heights from ICGEM, and their sum for the desired ellipsoid heights 
* ellipsoid_height_to_json.py - generates the json files for the various heights
* elevation_{ortho|geoid|ellip}.json - files, which are made by the above python script, contain the ortho, geoid, and ellip hight data. Only the ellip data are used for fixing source-point and field-point positions
