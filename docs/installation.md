# Installation

> We recommend using [Docker](https://www.docker.com/) to run the application.

## Docker

Docker is the easiest way to run the application.

### Before you begin

- Make sure you have [Docker](https://www.docker.com/) installed on your machine.
- Create a Google Sheet and share it with the service account email. See [this guide](https://support.google.com/a/answer/7378726?hl=en) for more information.
- Verify that the GIT is installed on your machine. If not, install it from [here](https://git-scm.com/downloads).


### Clone the repository


Check out the repository from GitHub:


```bash
git clone https://github.comn/n4ze3m/formshet.git
```

Go to the project docker directory:

```bash
cd formshet/docker
```

Copy the `.env.example` file to `.env` and update the environment variables:

```bash
cp .env.example .env
```

### Let's configure the application


1. Move your service account key json file to the `docker` directory with the name `google.json`. You can download the key from the Google Cloud Console (see [this guide](https://support.google.com/a/answer/7378726?hl=en) for more information).

2. Genrate a random string for the `FORMSHET_SECRET_KEY` variable. You can use [this website](https://randomkeygen.com/) to generate a random string.

### Run the application

Now, you can run the application using the following command:

```bash
docker-compose up -d
```

The application will be available at `http://localhost:3000`.

