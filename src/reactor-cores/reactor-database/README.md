# Notes on Updating the LF Database
The reactor LF database is now two seperate classes of csv files:

* reactors.csv - the master list of cores we know about, all cores in the DBnnnn.csv files must have an entry here
* DBnnnn.csv where the nnnn is the 4 digit year, there must only be 13 columns and no label header. The first column is the core name, and the next 12 columns are the monthly LF data in 0-100% (can be larger than 100 but should not be less than 0)

## Updating LFs
IAEA have provided us with the monthly LF data for 2020, these data need to be reduced down to the format of the DBnnnn.csv files.
I found this was easily done in a spreadsheet program (I used LibreOffice) and only needed to delete the columns/rows that were unneeded.

* After editing, put the new file named DBnnnn.csv (e.g. DB2020.csv) with the rest of the files named this way.
* edit the endDate constant in processsReactors.js to include the new date range.
* ensure that the reactors.csv file has any new cores, do not remove decommissioned cores, just update the offline column of that core to be not the year 2100. I do advise editing this by hand if you are able, spreadsheet programs can change a lot of rows.
* Run `npm run processReactorDB` and check for errors, hopefully none, but the most likely thing needed is core name adjustments in the DB file (they are exact and case sensistive)

* Finally, edit the web app in the following locations so it is now "aware" of new data:
  * src/reactor-cores/index.ts: find the loadFactor function and update the stop to include the new end year
  * src/ui/reactors-core-iaea-select.jsx: modify the "years" at the top to include the new end year + 1 (e.g. if you added 2020 LF data, the value in this var should be 2021)
  * change the default selected year range (start and end years) by modifying the reactorLF object in src/App.js
