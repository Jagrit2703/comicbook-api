# ComicBook API

Welcome to the ComicBook API! This API allows you to manage a collection of comic books, including adding new comics, retrieving details about existing comics, updating comic information, and deleting comics from the collection. This was made using AWS SDK for Javascript V3

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Installation

To get started with the ComicBook API, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/Jagrit2703/comicbook-api.git
    ```
2. Navigate to the project directory:
    ```bash
    cd comicbook-api
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```
4. Create a `.env` file in the root directory of the project and add your AWS credentials and region information:

    ```plaintext
    AWS_ACCESS_KEY_ID=your_access_key_id
    AWS_SECRET_ACCESS_KEY=your_secret_access_key
    AWS_REGION=your_aws_region
    ```

    Replace `your_access_key_id`, `your_secret_access_key`, and `your_aws_region` with your actual AWS credentials and desired region.
## Usage

To start the server, run the following command:
```bash
node index.js
```

The server will start on `http://localhost:3000`.

## API Endpoints

### Get All Comics
- **URL:** `/api/comics`
- **Method:** `GET`
- **Description:** Retrieve a list of all comics.

### Get Comic by ID
- **URL:** `/api/comics/:id`
- **Method:** `GET`
- **Description:** Retrieve details of a specific comic by its ID.

### Add New Comic
- **URL:** `/api/comics`
- **Method:** `POST`
- **Description:** Add a new comic to the collection.
- **Body Parameters:**
  - `title` (string): The title of the comic.
  - `author` (string): The author of the comic.
  - `publisher` (string): The publisher of the comic.
  - `year` (number): The year the comic was published.

### Update Comic
- **URL:** `/api/comics/:id`
- **Method:** `PUT`
- **Description:** Update the details of an existing comic.
- **Body Parameters:** (same as Add New Comic)

### Delete Comic
- **URL:** `/api/comics/:id`
- **Method:** `DELETE`
- **Description:** Delete a comic from the collection.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
