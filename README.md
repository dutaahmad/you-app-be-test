<p align="center">
  <a href="https://youapp.ai" target="blank"><img src="https://youapp.ai/static/images/youapp-full-purple-light.svg" width="120" alt="Nest Logo" /></a>
</p>

# YouApp Backend Test

## Prerequisites

1. Docker
2. Internet Connection (obviously 😂)

## Project setup

To test this application, you only need to execute the command below in your local machine.

```bash
cp .env.example .env && docker compose up --build -d
```

After that, you can access the application at `http://localhost:5555`.


## TL:DR

1. You can use MongoDB Compass to check the database and its contents. to do that please use this MongoDB URI below:

```bash
mongodb://localhost:27018
```

2. You can use Postman to test the API and Socket (please use the newest Postman version that supports WebSockets / SocketIO). Import these files to your Postman workspace:

- You App Custom BE.postman_environment.json
- YouApp.postman_collection.json
