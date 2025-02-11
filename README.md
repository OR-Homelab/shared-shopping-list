# Shared Shopping List

[![CodeQL Advanced](https://github.com/OR-Homelab/shared-shopping-list/actions/workflows/codeql.yml/badge.svg?branch=main)](https://github.com/OR-Homelab/shared-shopping-list/actions/workflows/codeql.yml)
[![Node.js CI](https://github.com/OR-Homelab/shared-shopping-list/actions/workflows/node.js.yml/badge.svg)](https://github.com/OR-Homelab/shared-shopping-list/actions/workflows/node.js.yml)
[![Docker](https://github.com/OR-Homelab/shared-shopping-list/actions/workflows/docker-publish.yml/badge.svg)](https://github.com/OR-Homelab/shared-shopping-list/actions/workflows/docker-publish.yml)

A collaborative web app for grocery and shopping lists. Add and check off items with live updates, and cross-device sync. Perfect for families, roommates, and teams!

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

The application can be deployed using Docker with the provided [docker-compose](./docker-compose.yml) file from the repository or run as a standalone application by downloading the repository.

### docker-compose

- Docker 25.x or higher
- Docker Compose 2.24.x or higher
- Windows, macOS, or Linux operating system

### Node.js self hosted

- Node.js 19.x or higher
- MongoDB 7.x or higher
- Windows, macOS, or Linux operating system

## Installation

The installation process varies depending on the usage of the provided [docker-compose](./docker-compose.yml) file, or downloading the entire repository.

### docker-compose installation

1. Create a folder where the files for the application will be stored.
2. Create a file named `docker-compose.yml`.
3. Paste the contents of the [docker-compose](./docker-compose.yml) file into the newly created `docker-compose.yml` file.
    - The environment variables of the [docker-compose](./docker-compose.yml) file should be changed before running the application.
    - When registering the first user the `REQUIRE_PASSWORD_FOR_REGISTER` variable should be set to `False`. (**REMEMBER TO CHANGE THE VALUE BACK TO TRUE!**)
4. Run `docker-compose up` to start the application.

### Node.js installation

1. Clone the repository:
    - `git clone https://github.com/OR-Homelab/shared-shopping-list.git`
    - `cd shared-shopping-list`
2. Install dependencies:
    - `npm install`
3. Setup the .env file
    - Remove the `.example` extension from the [.env.example](./.env.example) file. (*The file should be named '.env'*)
    - Change the values in the `.env` file.
4. Start the application:
    - `npm start`

The application should handle the database setup itself, as long as a proper MongoDB url is given in the `.env` file.

Look at the [Usage](#usage) part of the readme for a user-creation tutorial.

## Usage

Follow these steps, to use the shared-shopping-list application.

### Registering your first user

1. Stop the application if it is running.
2. Change the variable called `REQUIRE_PASSWORD_FOR_REGISTER` to `False` in the `.env` file.
3. Start the application again.
4. Access the register page from `(YOUR_URL)/register`, to register your first user.
5. Stop the application and change the `REQUIRE_PASSWORD_FOR_REGISTER` variable back to `True`.

After these steps are completed, the registered users, will be able to register new users on the register page.

### Using the application

1. Login to the application (*If a user is not already registered, read [Registering your first user](#registering-your-first-user)*)
2. Using the nav-bar on the left, items can be added and removed from the shopping list.

## Contributing

## License

This project is licensed under the Apache-2.0 License - see the [LICENSE](LICENSE) file for details.

## Third-Party Licenses

- body-parser (MIT License)
- connect-ensure-login (MIT License)
- dotenv (BSD-2-Clause License)
- ejs (Apache-2.0 License)
- express (MIT License)
- passport-local-mongoose (MIT License)
- passport (MIT License)
- mongoose (MIT License)
- express-slow-down (MIT License)
- express-session (MIT License)
- express-rate-limit (MIT License)
- path (MIT License)

## Last Updated

This README was last updated on 2025-02-10.
