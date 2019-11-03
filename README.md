# Fitbit to Withings weight export
Convert data exported from a Fitbit Aria scale to a format Withings can import.

## Pre-reqs
- Node 12
- Make sure both Fitbit and Withings are set to pounds (Lb) for weight

## How to use

1. Export account archive data from Fitbit at https://www.fitbit.com/settings/data/export, scroll all the way down and create your archive. This may take a while.
2. Once your archive is created and downloaded, extract it and copy all `weight-*.json` files from the `user-site-export` folder to the `weight` folder here.
3. Run the tool using `npm run`. One or more `output-*.csv` files will be created.
4. In Withings website, go to Settings, click your initials and click "Import my data". Upload the output CSV files in the Weight section.