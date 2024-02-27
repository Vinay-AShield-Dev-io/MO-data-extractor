<h1>AShield Technologies Pvt. Ltd.</h1>
<p>Copyright @2024 AShield Technologies<p>
<h4>This repository contains functions to extract clickless application's MO-fail data.</h4>

## 1. Introduction

### Overview

The Application will run mongoDB queries on clickless database and then sends statistical reports over email and slack.

### Purpose

This documentation serves as a guide for developers and administrators to understand, integrate, and use the mongoDB purge operation script along with MO-data extractor script.

## 2. Getting Started

### Prerequisites

Before using the FIDO Application, make sure you have the following:

- npm verion 10.2.0
- node v21.1.0
- typescript v5.3.5
- MongoDB Command Line Database Tools v100.9.4
- MongoDB Shell v2.1.5

### Installation

Follow these steps to install the FIDO Application:

- Download the latest release on "projectPurgeDB" from the [GitHub repository] (https://github.com/AShield2-0/MO-data-extractor.git).
- set ENVIRNMENT VARIABLE :- MONGO_URL=MongoDB URI of AshieldClickless Database.
- run `npm i`
- run `tsc`
- run `node dist/src/mongoDBScripts/purgeOps.js ${FromDate} ${ToDate}`

## 3. Configuration

Edit the `utils/const.ts` file to set up the Application
Before running the script, set the below environment variables <br>
`AZURE_CONNECTION_STRING=<Azure Email Communication Service Token>` <br>
`MONGO_URL=<Bajaj Prod MonGOURI>` <br>
`NODE_ENV= <"dev" | "prod" | "staing">` <br>

## 4. Usage

### run instruction

This script optionally takes 2 command line inputs. this application is designed to run and generate reports for every hour's 5th minute.

1. `from ISO Datetime`: the first command line input is the ISO datetime: start datetime
2. `from ISO Datetime`: the second command line input is the ISO datetime: end datetime

## 5. Recent changes made in Repository are:

<ol>
    <li>Hoisted all constants to the `config file`.</li>
    <li>Added more insights like "totoal failed percent", "total expired percentage".</li>
    <li>Added schedular to run this script every hour is 5'th minute.</li>
    <li>Added docker files.</li>
    <li>Added the code to delete or update the data when from and to date is passed as an argument.</li>
    <li>Added the code for counting of mongoDB records and exporting them before deletion and after deletion.</li>
    <li>Added code to write logs in ./logs/applogs.log</li>
    <li>Updated the code as per code review from Srinni sir.</li>
</ol>

## 6. SYSTEM REQUIREMENTS:
