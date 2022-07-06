# Notes on Updating the LF Database
The reactor LF database is now two seperate classes of csv files:

* reactors.csv - the master list of cores we know about, all cores in the DBnnnn.csv files must have an entry here
* DBnnnn.csv where the nnnn is the 4 digit year, there must only be 13 columns and no label header. The first column is the core name, and the next 12 columns are the monthly LF data in 0-100% (can be larger than 100 but cannot be less than 0; change negative values to 0)

## Updating LFs
IAEA now provide monthly LF data starting with the year 2020 and these data need to be reduced down to the format of the DBnnnn.csv files.
This is easily done in a spreadsheet program (e.g. LibreOffice, Numbers, etc.) by deleting the unneeded columns/rows.

* Put the new file named DBnnnn.csv (e.g. DB2021.csv) with the rest of the files named this way (src/reactor-cores/reactor-database/).
* Edit the endDate constant in processsReactors.js to include the new date range.
* Ensure that the reactors.csv file has any new cores. Do not remove decommissioned cores, just update the offline column of that core to be not the year 2100. I do advise editing this by hand if you are able, spreadsheet programs can change a lot of rows.
* Run `npm run processReactorDB` and check for errors, hopefully none. If the Build Fails, the most likely errors are unmatched core names (they are exact and case sensistive) and negative LFs in the DB file 

* Finally, edit the web app in the following locations so it is now "aware" of new data:
  * src/reactor-cores/index.ts: find the loadFactor function and update the stop to include the new end year
  * src/ui/reactors-core-iaea-select.jsx: modify the "years" at the top to include the new end year + 1 (e.g. if you added 2020 LF data, the value in this var should be 2021)
  * Change the default start and end years for the IAEA Load Factor Date Range selection by modifying the reactorLF object in src/App.js
