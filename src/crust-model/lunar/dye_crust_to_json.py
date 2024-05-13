import json
import numpy as np

import logging
logging.basicConfig(level=logging.INFO)

k40 = np.loadtxt("k40bflux_map_496.txt")
th232 = np.loadtxt("th232flux_map_496.txt")
u238 = np.loadtxt("u238flux_map_496.txt")


data = {
    "u": (u238 / 1e6).tolist(),
    "th": (th232 / 1e6).tolist(),
    "k": (k40 / 1e6).tolist(),
}

class RoundingFloat(float):
    __repr__ = staticmethod(lambda x: format(x, '.3f'))

json.encoder.c_make_encoder = None

json.encoder.float = RoundingFloat
for element, flux in data.items():
    with open(f"crust_{element}.json", "w") as f:
        json.dump(flux, f, separators=(',', ':'))
