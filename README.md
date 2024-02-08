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

3. Setup Config by renaming the `config.example.json` to `config.json` and filling in the required information. (More information on the configuration options can be found [here](#configuration-options))
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

## configuration Options

### Port

The `port` option is the port that the API is running on. This is not required to be changed unless you are running someone else on the default `3000` port.

### URL

The `url` option is the url that the API is running on. For example if the API is running on `https://example.com` then the `url` option would be `https://example.com`. This needs to be set so the API knows what url to use when generating the ShareX config file and returning the file url when the user uploads a file.

### Name Hide

The `nameHide` option hides the original file name and generates a random name for the file. This file name is 10 characters long and is a random string of all the letters in the alphabet (upper and lower) and 0-9. This is useful for hiding the original file name and making it harder for people to guess the file name.

### Key

The `key` option is the key that is used to authenticate the user when uploading a file. This must be set to a random string of characters and should be kept secret. This is used to authenticate the user when uploading a file to the API. This is useful for stopping people from uploading files to your API without your permission.

### Max File Size

The `maxFileSize` option is the maximum file size that the API will accept. This is useful for stopping people from uploading large files to your API and using up all of your server space. This is set in bytes and the default is `104857600 Bytes` (100mb) due to Cloudflare tunnel's max `free` plan only supports 100mb file size.
