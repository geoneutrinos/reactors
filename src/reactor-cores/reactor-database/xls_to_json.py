import json

import pyexcel

import logging
logging.basicConfig(level=logging.INFO)

columns = [
        "country",
        "name",
        "lat",
        "lon",
        "type",
        "mox",
        "power",
        *[str(d) for d in range(1,13)]
        ]

years = [
        "2003",
        "2004",
        "2005",
        "2006",
        "2007",
        "2008",
        "2009",
        "2010",
        "2011",
        "2012",
        "2013",
        "2014",
        "2015",
        "2016",
        "2017",
        "2018",
        "2019",
    ]

reactor_data = {}
all_names = set()

reactors = {}
times = []
loads = {}

elevation = {}

with open("Ultralytics Worldwide Reactor Database - PRIS MAR2016.csv", 'r') as f:
    for line in f:
        parts = line.split(",")
        offset = 0
        if len(parts) == 15:
            offset += 1
        if parts[0] == "":
            continue
        name = parts[2]
        lat = float(parts[9 + offset])
        lon = float(parts[10+ offset])
        altitude = float(parts[11 + offset])
        if lat == 0 and lon == 0:
            continue

        elevation[name] = altitude


for year in years:
    file = "DB" + year + ".xls"

    data = pyexcel.get_array(file_name=file)

    if file == "DB2011.xls":
        # the 2011 file has a one line header
        data.pop(0)

    year_data = {d[1].strip().upper():{col:val for col, val in zip(columns, d)} for d in data}

    reactor_data[year] = year_data

    names = {d[1].strip().upper() for d in data}
    logging.info(names - all_names)
    all_names.update(names)

for name in all_names:
    if name == "":
        continue
    empty = [0] * 12
    loads[name] = []
    ele = 0
    try:
        ele = elevation.pop(name)
    except KeyError:
        logging.warn(f"No elevation data for {name}")
    for year in years:
        try:
            loads[name].extend([reactor_data[year][name][month] for month in [str(d) for d in range(1,13)]])
            reactors[name] = {
                'lat' : float(reactor_data[year][name]['lat']),
                'lon' : float(reactor_data[year][name]['lon']),
                'power' : float(reactor_data[year][name]['power']),
                'type' : reactor_data[year][name]['type'].strip(),
                'mox' : reactor_data[year][name]['mox'],
                'elevation': float(ele), # above WGS85 (not above EGM96)
                }
            #logging.warn((name, reactors[name]))
        except KeyError:
            loads[name].extend(empty)

    loads[name] = list(map(lambda x: max(x, 0), loads[name]))

logging.info(f"Remaining cores in elevation db: {elevation}")

for year in years:
    times.extend(["{0}-{1:0>2}".format(year,m) for m in range(1,13)])

print(json.dumps({
    "reactors": reactors,
    "times": times,
    "loads": loads,
    }, sort_keys=True, separators=(',', ':')))
