# Soccer Stats Hub 🚀


<details>
  <summary><strong>🐳 Docker</strong></summary>

  - `git clone git@github.com:alinesresende/soccer-stats-hub`

  - `npm install`

> Run the `app` and `db` services with the command `docker-compose up`.

- These services will start up a container named `frontend` and another named `backend`.

  > Run the `npm run db:reset` command (this command will work only after creating the requested types in the requirement) to create the database, the tables that will be used and populate them.

</details>

</details>

# Challenges

This application is composed of 4 main flows:
1. Teams (Teams)
2. Users and Login (Users and Access Credentials)
3. Matches (Matches)
4. Leaderboards

## Flow 1: Teams (Times)

### 1.1 - Created the `/teams` endpoint in the backend so that it can return all teams 

  - It should be a `GET` route with a response with status `200` and a `json` containing the return in the following model:

```json
[
  {
    "id": 1,
    "teamName": "Avaí/Kindermann"
  },
  {
    "id": 2,
    "teamName": "Bahia"
  },
  {
    "id": 3,
    "teamName": "Botafogo"
  },
]
```


### 1.2 - Created the `/teams/:id` endpoint in the backend so that it can return data from a specific team

  - It should be a `GET` route with a response with status `200` and a `json` containing the return in the following model:

```json
{
  "id": 5,
  "teamName": "Cruzeiro"
}
```


## Flow 2: Users and Login (Users and Access Credentials)

- The route used must be (`/login`);

- The route must have the fields `email` and `password` and these fields must be validated in the database:
  - The `email` field must receive a valid email. Ex: `tfc@project.com`;
  - The `password` field must have more than 6 characters.
  - In addition to being valid, it is necessary that the email and password are registered with the bank in order to login;

- The body of the request must contain the following format:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```


### 2.1 - Created `/login` endpoint on the backend so that it allows access with valid data on the frontend

  - The route must be of type `POST`;

  - If the login was successful, the result returned should be similar to the one shown below, with a status http `200`:

    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjU0NTI3MTg5fQ.XS_9AA82iNoiVaASi0NtJpqOQ_gHSHhxrpIdigiT-fc" 
    }
    ```

  - If the login does not have the "email" field, the result returned should be the message below, with an http status `400`:

    ```json
    { "message": "All fields must be filled" }
    ```

- If the login does not have the "password" field, the result returned should be as shown below, with an http status `400`:

    ```json
    { "message": "All fields must be filled" }
    ```

### 2.3 - Created the `/login` endpoint on the backend so that it doesn't allow access with an unregistered email or incorrect password on the frontend

- If the login has the "email" **invalid** or the "password" **invalid**, the result returned will be similar to the one shown below, with a status http `401`:

  ```json
    { "message": "Invalid email or password" }
  ```

- Being invalid emails:
  - Emails with invalid format: `@example.com`, `example@example`, `example@.com`, `example.example.com`;
  - Emails with valid format, but not registered in the bank;
- If passwords are invalid:
  - Passwords with invalid format: with a length **smaller** than `6 characters`;
  - Passwords with valid format, but not registered in the bank;


### 2.4 - Created a validation middleware for the `token`

  - It must be a `GET` route that receives a `header` with `authorization` parameter, where the token generated at login will be stored;

  - If the token is not informed, the following message must be returned with a `401` status:

  ```json
  { "message": "Token not found" }
  ```

  - If the informed token is not valid, the following message must be returned with a `401` status:

  ```json
  { "message": "Token must be a valid token" }
  ```

  The response should be status `200` with an `object` containing the `role` of *user*:
  ```json
    { "role": "admin" }
  ```


## Flow 3: Matches 

### 3 - Build the `/matches` endpoint so that the data appears correctly on the front-end match screen

- The route must be a `GET` and returns a list of matches;

    Return example:

    ```json
    [
      {
        "id": 1,
        "homeTeamId": 16,
        "homeTeamGoals": 1,
        "awayTeamId": 8,
        "awayTeamGoals": 1,
        "inProgress": false,
        "homeTeam": {
          "teamName": "São Paulo"
        },
        "awayTeam": {
          "teamName": "Grêmio"
        }
      },
      ...
      {
        "id": 41,
        "homeTeamId": 16,
        "homeTeamGoals": 2,
        "awayTeamId": 9,
        "awayTeamGoals": 0,
        "inProgress": true,
        "homeTeam": {
          "teamName": "São Paulo"
        },
        "awayTeam": {
          "teamName": "Internacional"
        }
      }
    ]
    ```

### 3.1 - Created the `/matches` endpoint so that it is possible to filter only ongoing matches

  - The route must be of type `GET` and return a list of filtered matches;

  - This request must use `query string` to define the parameter:
    ex: `matches?inProgress=true`

  Example return request:
  ```json
  [
    {
      "id": 41,
      "homeTeamId": 16,
      "homeTeamGoals": 2,
      "awayTeamId": 9,
      "awayTeamGoals": 0,
      "inProgress": true,
      "homeTeam": {
        "teamName": "Sao Paulo"
      },
      "awayTeam": {
        "teamName": "International"
      }
    },
    {
      "id": 42,
      "homeTeamId": 6,
      "homeTeamGoals": 1,
      "awayTeamId": 1,
      "awayTeamGoals": 0,
      "inProgress": true,
      "homeTeam": {
        "teamName": "Railway"
      },
      "awayTeam": {
        "teamName": "Avaí/Kindermann"
      }
    }
  ]
  ```

  - This request must use `query string` to define the parameter.
    ex: `matches?inProgress=false`

  Example return request:
  ```json
  [
    {
      "id": 1,
      "homeTeamId": 16,
      "homeTeamGoals": 1,
      "awayTeamId": 8,
      "awayTeamGoals": 1,
      "inProgress": false,
      "homeTeam": {
        "teamName": "Sao Paulo"
      },
      "awayTeam": {
        "teamName": "Grêmio"
      }
    },
    {
      "id": 2,
      "homeTeamId": 9,
      "homeTeamGoals": 1,
      "awayTeamId": 14,
      "awayTeamGoals": 1,
      "inProgress": false,
      "homeTeam": {
        "teamName": "International"
      },
      "awayTeam": {
        "teamName": "Saints"
      }
    }
  ]
  ```

### 3.2 - Created the `/matches/:id/finish` endpoint so that it is possible to finish a match in the database

- The route must be of type `PATCH`;

- If the token is not informed, the following message must be returned with a `401` status:

  ```json
  { "message": "Token not found" }
  ```

- If the informed token is not valid, the following message must be returned with a `401` status:

  ```json
  { "message": "Token must be a valid token" }
  ```

- It will be validated that, at the end of a match, the change is made in the database and on the page.

- It must return, with a `200` status, the following message:

  ```json
  { "message": "Finished" }
  ```

### 3.3 - Created the `/matches/:id` endpoint so that it is possible to update matches in progress

- The endpoint must be of type `PATCH`;

- If the token is not informed, the following message must be returned with a `401` status:

  ```json
  { "message": "Token not found" }
  ```

- If the informed token is not valid, the following message must be returned with a `401` status:

  ```json
  { "message": "Token must be a valid token" }
  ```

- It will be evaluated that it is possible to change the result of a match.

- The body of the request will have the following format:

  ```json
  {
    "homeTeamGoals": 3,
    "awayTeamGoals": 1
  }
  ```


### 3.4 - Develop the `/matches` endpoint so that it is possible to register a new match in progress in the database

- The route must be of type `POST` and return the match inserted in the database;

- If the token is not informed, the following message must be returned with a `401` status:

  ```json
  { "message": "Token not found" }
  ```

- It will be validated that it is not possible to enter a match with an invalid token;

- If the informed token is not valid, the following message must be returned with a `401` status:

  ```json
  { "message": "Token must be a valid token" }
  ```

- It will be validated that it is possible to save a game in the database and see the game on the games page;

- The body of the request will have the following format:

  ```json
  {
    "homeTeamId": 16, // The value must be the team id
    "awayTeamId": 8, // The value must be the team id
    "homeTeamGoals": 2,
    "awayTeamGoals": 2,
  }
  ```

- If the match is successfully inserted, the match data must be returned, with _status_ `201`:

  ```json
  {
    "id": 1,
    "homeTeamId": 16,
    "homeTeamGoals": 2,
    "awayTeamId": 8,
    "awayTeamGoals": 2,
    "inProgress": true,
  }
  ```

### 3.5 - Created the `/matches` endpoint so that it is not possible to insert a match with equal teams or with a team that does not exist in the teams table

  - It is not possible to insert a match in which the `homeTeam` and the `awayTeam` are the same, for example: Barcelona x Barcelona;

  - If this occurs, the following message must be returned with a `422` status:

  ```json
  { "message": "It is not possible to create a match with two equal teams" }
  ```

  - It will be validated that it is not possible to insert a match with a team that does not exist in the teams table;

  - If any of the teams is not registered in the database, the following message must be returned with a status `404,`:

  ```json
  { "message": "There is no team with such id!" }
  ```


## Flow 4: Leaderboards 

## Leaderboard Home

### 4.1 - Created the endpoint `/leaderboard/home` so that it returns information about the performance of the home teams

 - The endpoint must be of type `GET`;

- The request to the endpoint `/leaderboard/home` will return the correct fields and values, considering the initial data of the database;

   <details>
<summary><strong> Return example: </strong></summary> <br/>

```json
[
  {
    "name": "Corinthians",
    "totalPoints": 6,
    "totalGames": 2,
    "totalVictories": 2,
    "totalDraws": 0,
    "totalLosses": 0,
    "goalsFavor": 6,
    "goalsOwn": 1,
  },
  {
    "name": "Santos",
    "totalPoints": 9,
    "totalGames": 3,
    "totalVictories": 3,
    "totalDraws": 0,
    "totalLosses": 0,
    "goalsFavor": 9,
    "goalsOwn": 3,
  },
  {
    "name": "Palmeiras",
    "totalPoints": 7,
    "totalGames": 3,
    "totalVictories": 2,
    "totalDraws": 1,
    "totalLosses": 0,
    "goalsFavor": 10,
    "goalsOwn": 5,
  },
  ...
]
```

</details>

### 4.2 - Created the endpoint `/leaderboard/home` so that it is possible to filter the rankings of the home teams in the front-end 

  - The endpoint must be of type `GET`;


```json
[
  {
    "name": "Santos",
    "totalPoints": 9,
    "totalGames": 3,
    "totalVictories": 3,
    "totalDraws": 0,
    "totalLosses": 0,
    "goalsFavor": 9,
    "goalsOwn": 3,
    "goalsBalance": 6,
    "efficiency": "100.00"
  },
  {
    "name": "Palmeiras",
    "totalPoints": 7,
    "totalGames": 3,
    "totalVictories": 2,
    "totalDraws": 1,
    "totalLosses": 0,
    "goalsFavor": 10,
    "goalsOwn": 5,
    "goalsBalance": 5,
    "efficiency": "77.78"
  },
 ...
]
```
</details>

### 4.3 - Created the `/leaderboard/home` endpoint so that it is possible to filter the rankings of home teams 

  - After adding the Corinthians 2 X 1 Internacional match and making the request to the `/leaderboard/home` endpoint, the correct fields and values ​​will be returned.


```json
[
  {
    "name": "Santos",
    "totalPoints": 9,
    "totalGames": 3,
    "totalVictories": 3,
    "totalDraws": 0,
    "totalLosses": 0,
    "goalsFavor": 9,
    "goalsOwn": 3,
    "goalsBalance": 6,
    "efficiency": "100.00"
  },
  {
    "name": "Corinthians",
    "totalPoints": 9,
    "totalGames": 3,
    "totalVictories": 3,
    "totalDraws": 0,
    "totalLosses": 0,
    "goalsFavor": 8,
    "goalsOwn": 2,
    "goalsBalance": 6,
    "efficiency": "100.00"
  },
 ...
]
```
</details>

## Leaderboard away

### 4.4 - Develop the endpoint `/leaderboard/away` so that it returns information on the performance of away teams 

 - The endpoint must be of type `GET`;


```json
[
  {
    "name": "Corinthians",
    "totalPoints": 6,
    "totalGames": 3,
    "totalVictories": 2,
    "totalDraws": 0,
    "totalLosses": 1,
    "goalsFavor": 6,
    "goalsOwn": 2,
  },
  {
    "name": "Palmeiras",
    "totalPoints": 6,
    "totalGames": 2,
    "totalVictories": 2,
    "totalDraws": 0,
    "totalLosses": 0,
    "goalsFavor": 7,
    "goalsOwn": 0,
  },
  {
    "name": "Internacional",
    "totalPoints": 6,
    "totalGames": 2,
    "totalVictories": 2,
    "totalDraws": 0,
    "totalLosses": 0,
    "goalsFavor": 3,
    "goalsOwn": 0,
  },
  ...
]
```

</details>

### 4.5 - Created the `/leaderboard/away` endpoint so that you can filter team rankings when visiting the front-end leaderboard screen

  - The endpoint must be of type `GET`;


```json
[
  {
    "name": "Palmeiras",
    "totalPoints": 6,
    "totalGames": 2,
    "totalVictories": 2,
    "totalDraws": 0,
    "totalLosses": 0,
    "goalsFavor": 7,
    "goalsOwn": 0,
    "goalsBalance": 7,
    "efficiency": "100.00"
  },
  {
    "name": "Corinthians",
    "totalPoints": 6,
    "totalGames": 3,
    "totalVictories": 2,
    "totalDraws": 0,
    "totalLosses": 1,
    "goalsFavor": 6,
    "goalsOwn": 2,
    "goalsBalance": 4,
    "efficiency": "66.67"
  },
  {
    "name": "Internacional",
    "totalPoints": 6,
    "totalGames": 2,
    "totalVictories": 2,
    "totalDraws": 0,
    "totalLosses": 0,
    "goalsFavor": 3,
    "goalsOwn": 0,
    "goalsBalance": 3,
    "efficiency": "100.00"
  },
 ...
]
```
</details>

### 4.6 - Created the endpoint `/leaderboard/away` so that it is possible to filter team rankings when visiting the front-end ranking screen 

  - After adding the Corinthians 2 X 1 Internacional match and making the request to the `/leaderboard/away` endpoint, the correct fields and values ​​will be returned.


```json
[
  {
    "name": "Palmeiras",
    "totalPoints": 6,
    "totalGames": 2,
    "totalVictories": 2,
    "totalDraws": 0,
    "totalLosses": 0,
    "goalsFavor": 7,
    "goalsOwn": 0,
    "goalsBalance": 7,
    "efficiency": "100.00"
  },
  {
    "name": "Corinthians",
    "totalPoints": 6,
    "totalGames": 3,
    "totalVictories": 2,
    "totalDraws": 0,
    "totalLosses": 1,
    "goalsFavor": 6,
    "goalsOwn": 2,
    "goalsBalance": 4,
    "efficiency": "66.67"
  },
  {
    "name": "Internacional",
    "totalPoints": 6,
    "totalGames": 3,
    "totalVictories": 2,
    "totalDraws": 0,
    "totalLosses": 1,
    "goalsFavor": 4,
    "goalsOwn": 2,
    "goalsBalance": 2,
    "efficiency": "66.67"
  },
  ...
]
```
</details>


