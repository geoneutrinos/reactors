"""
Convert the knt files to a JSON format suitable for the webapp

Since we know the bin size (1KeV) and it is the same for all, we are just going to
discard that information.

We also discard all the trailing zero values.

The result is an array of variable length for each decay chain, the first element 
is the antineutrino specturm for the bin centered at 0.5 KeV and is 1KeV wide. The next element 
is for the bin ceneted at 1.5KeV and so on.
"""
import os
import json

for root, dirs, files in os.walk("data"):
    for file in files:
        src = os.path.join(root, file)
        with open(src) as f:
            data = f.read().splitlines()
        dst = f"{src}.json"
        
        processed = []
        for line in data:
            d = line.split(" ", 2)
            if len(d) != 2:
                continue

            bv, ev = float(d[0]), float(d[1])

            processed.append(ev)

        while processed[-1] == 0:
            del processed[-1]

        with open(dst, 'w') as f:
            json.dump(processed,f)