[![Node.js CI](https://github.com/BlueMoonDevelopment/ExpenseMan-web/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/BlueMoonDevelopment/ExpenseMan-web/actions/workflows/node.js.yml) ![Expensemanapp](https://cronitor.io/badges/DKXIei/production/QInGYTUwemwAcsXVREMF7N17HC4.svg)

# Status

See [Status](https://expenseman.cronitorstatus.com/) for uptime statistics

# First installation

NPM, NodeJS and PM2 need to be installed.
On First startup, run 
npm install
npm run css-build
to install all the neccessary dependencies.

# Development

simply run "npm run dev" to start server and let it restart once changes are made.

# Production
rename config.example.json to config.json and set your settings.
Then to start the webserver just run the start.sh, to stop just run the stop.sh

Pug documentation: https://pugjs.org/api/getting-started.html
NodeJS documentation: https://nodejs.org/en/docs/guides/
