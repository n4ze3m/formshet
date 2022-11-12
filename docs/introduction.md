# Introduction

> A form backend for your application using Google Sheets as database.

## What is FormShet?

FormShet is a simple and lightweight form backend for your application. It stores data directly to Google Sheets and sends you an email notifications when a new form is submitted.

## A sample form


```html
<form
  action="https://demo.formshet.n4ze3m.site/api/v1/form/cladzv12f0001od70x35jef8y/submit"
  method="POST"
>
  <input type="text" name="name" placeholder="Enter name" />
  <input type="text" name="messaage" placeholder="Enter messaage" />
  <button type="submit">Submit</button>
</form>
```

*_Form preview for the above code:_*

<form
  action="https://demo.formshet.n4ze3m.site/api/v1/form/cladzv12f0001od70x35jef8y/submit"
  method="POST"
>
  <input type="text" name="name" placeholder="Enter name" />
  <input type="text" name="messaage" placeholder="Enter messaage" />
  <button type="submit">Submit</button>
</form>

> Note: The form will be submitted to the demo server. You can use your own server by following the [installation guide](#installation).

## Motivation

Google Sheets is a great tool for storing data and it is free to use. It is also easy to use and share with others. So, why not use it as a database for your application? This project is a simple solution to that problem and it is also open source. 

All you need to do is to create a Google Sheet and share it with the service account email. Then, you can use the sheet as a database for your application.


## Why FormShet?

- Simple and lightweight
- Store data directly to Google Sheets
- Get notified from any channel (email, Slack, etc.) using [Courier](https://courier.com)
- Open source

## Prerequisites

- A Google account
- A Google Sheet
- A service account email (see [this guide](https://support.google.com/a/answer/7378726?hl=en) for more information)
- Docker (optional) or Node.js


## Features

-  Store data directly to Google Sheets
-  Get notified via any channel (email, Slack, etc.) using [Courier](https://courier.com)
-  Open source
-  Accout management
-  Form management (create, update, delete)

## Roadmap (upcoming features)

-  Form builder (create forms using a simple UI)
-  Access form data using a simple API
-  Form analytics
-  Webhooks
-  Team management (create teams and share forms with team members)

## Community

If you have any questions or suggestions, please feel free to open an issue or contact me on [Twitter](https://twitter.com/n4ze3m).
