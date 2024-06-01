import json
import numpy as np
from pathlib import Path

import logging
logging.basicConfig(level=logging.INFO)

flux_convert = 1e6

path = Path(".")

class RoundingFloat(float):
    __repr__ = staticmethod(lambda x: format(x, '.3f'))

json.encoder.c_make_encoder = None

for file in path.glob("*.txt"):
    data = np.loadtxt(file)
    json.encoder.float = float
    if "flux_" in str(file):
        data = data / flux_convert
        json.encoder.float = RoundingFloat
        
    with open(file.with_suffix(".json"), "w") as f:
        json.dump(data.tolist(), f, separators=(',', ':'))
