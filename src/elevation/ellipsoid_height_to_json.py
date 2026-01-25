import json

import pyexcel

import logging
logging.basicConfig(level=logging.INFO)

raw_data = pyexcel.get_array(file_name="Earth_Ellipsoid_Height.xlsx")


data = {
    "o": [],
    "g": [],
    "e": [],
}

O_COL = 2
G_COL = 3
E_COL = 4

# The first two rows are header info, so just start at the data
for row in raw_data[2:]:
    if row[0] == "":
        # This should be the end of the data, to just stop
        break
    # precision in the excel is 2, so keep that
    data["o"].append(round(float(row[O_COL]), 2))
    data["g"].append(round(float(row[G_COL]), 2))
    data["e"].append(round(float(row[E_COL]), 2))

# the input data is on a 1x1 degree grid of lon lats
expected_array_length = 360 * 180
assert(len(data["o"]) == expected_array_length)
assert(len(data["g"]) == expected_array_length)
assert(len(data["e"]) == expected_array_length)

json.encoder.FLOAT_REPR = lambda f: ("%.3f" % f)
for element, flux in data.items():
    with open(f"crust_{element}.json", "w") as f:
        json.dump(flux, f, separators=(',', ':'))
