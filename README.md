# typescript-koa-mongo
 A simple crud server which support auth and  post. The idea of this project is 
 make controller as each module's entry point and handle route, model, etc.

## Architecture
 - app
   Entry point and initialize controllers and middlewares and connect to database.
 - module
   Controller is the entry point in each module. It initializes module route and 
   provide counterpart handlers.
 - middlewares
 - execeptions

## Setup
 - Make your own .env
 - ```docker-compose up -d ```
 - 
```javascript
 yarn
 npm run dev
```

# Tech stack
  - koa
  - typescript
  - mongo
  - jwt
  - docker
## Reference
- https://wanago.io/2018/12/03/typescript-express-tutorial-routing-controllers-middleware

## RoadMap
- Use DI to inject model to controller.

## LICENSE

MIT
