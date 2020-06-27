import requests
import json

uri = "https://physics.nist.gov/cgi-bin/Compositions/stand_alone.pl?ele=&all=all&ascii=ascii2&isotype=some"

data = requests.get(uri)

elements = []

lc = 0
elm = {}
for line in data.iter_lines(decode_unicode=True):
    if line.startswith("Atomic Number"):
        lc = 1

    if lc > 0:
        key, value = line.split("=")
        key = key.strip().lower().replace(" ", "_")
        value = value.strip()
        if "nbsp" in value:
            value = ""
        try:
            value = int(value)
        except ValueError:
            try:
                value = value.split("(")[0]
                value = float(value)
            except ValueError:
                pass

        elm[key] = value
        lc += 1

    if lc == 8:
        elements.append(elm)
        lc = 0
        elm = {}

with open("elements.json", "w") as f:
    json.dump(elements, f, sort_keys=True, indent=1)
