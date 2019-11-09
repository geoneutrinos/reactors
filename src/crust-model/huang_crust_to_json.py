import json

import pyexcel

import logging
logging.basicConfig(level=logging.INFO)

raw_data = pyexcel.get_array(file_name="Huang_crust_flux.xlsx")


data = {
    "u": [],
    "th": [],
    "k": [],
}

U_COL = 2
TH_COL = 3
K_COL = 4

# The first two rows are header info, so just start at the data
for row in raw_data[2:]:
    if row[0] == "":
        # This should be the end of the data, to just stop
        break
    data["u"].append(float(row[U_COL]))
    data["th"].append(float(row[TH_COL]))
    data["k"].append(float(row[K_COL]))

# the input data is on a 1x1 degree grid of lon lats
expected_array_length = 360 * 180
assert(len(data["u"]) == expected_array_length)
assert(len(data["th"]) == expected_array_length)
assert(len(data["k"]) == expected_array_length)

for element, flux in data.items():
    with open(f"crust_{element}.json", "w") as f:
        json.dump(flux, f)
