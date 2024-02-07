<h1 align="center">ShareX-API</h1>

<h2 align="center">API Thats designed for use with ShareX to upload your files to a web server.</h2>

This ShareX-API is designed to use the Custom Uploader feature that is build into ShareX. This API is designed to be used as a cdn for your files. The API is built using Express for the backend.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Setup](#setup)

## Prerequisites

In order to use this API you will need to have the following:

- A domain with dns records pointing to your server
- A server with the following installed:
  - Node.JS installed (Tested/Built with node v20.9.0)
  - Git installed
  - A process manager (optional)
  - A Reverse Proxy (optional, tested with CloudFlare Tunnels)

## Installation

1. Clone the repository to your server by running the following command:

```bash
git clone https://github.com/Kathund/ShareX-API.git
```

2. Install the dependencies by running the following command:

```bash
npm install
```

3. Setup Config by renaming the `config.example.json` to `config.json` and filling in the required information.
4. Start the API by running the following command:

```bash
npm start
```

## Setup

To setup your new ShareX API and make it work with ShareX you will need to do the following:

1. Have the api running
2. In your console you will see `Config is available to be generated @ <URL>`, After going to that url you will be promoted to save a file called `ShareX-API-Config.sxcu` This file is a ShareX Custom Uploader Configuration file.
3. From there navigate to folder where you have downloaded the config file and open it with ShareX.
4. Your will be promoted if you want ot make `ShareX-Uploader` your default uploader, click yes.
5. You are now ready to use the API with ShareX.
