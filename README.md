<h1>AShield Technologies Pvt. Ltd.</h1>
<p>Copyright @2024 AShield Technologies<p>
<h4>This repository contains functions to extract clickless application's MO-fail data.</h4>

## 1. Introduction
### Overview
The Application will run mongoDB queries on clickless database and then sends statistical reports over email and slack.

### Purpose
This documentation serves as a guide for developers and administrators to understand, integrate, and use the MO-fail data extractor script.

## 2. Getting Started
### Prerequisites
Before using the FIDO Application, make sure you have the following:
- npm verion 10.2.0
- node v21.1.0
- typescript v5.3.5

### Installation
Follow these steps to install the FIDO Application:
- Download the latest release from the [GitHub repository] (https://github.com/AShield2-0/MO-data-extractor.git).
- run `npm i`
- run `tsc`
- run `node dist/src/app.js`

## 3. Configuration

Edit the `utils/const.ts` file to set up the Application
Before running the script, set the below environment variables
`AZURE_CONNECTION_STRING=<Azure Email Communication Service Token>`
`MONGO_URL=<Bajaj Prod MonGOURI>`
`NODE_ENV= <"dev" | "prod" | "staing">`

## 4. Usage

### run instruction
This script takes 2 command line inputs. this application is designed to run and generate reports for every hour.

1. `from ISO Datetime`: the first command line input is the ISO datetime: start datetime
2. `from ISO Datetime`: the second command line input is the ISO datetime: end datetime


## 5. Recent changes made in Repository are: 
<ol>
    <li>Hoisted all constants to the `config file`.</li>
    <li>Added more insights like "totoal failed percent", "total expired percentage".</li>
</ol>
