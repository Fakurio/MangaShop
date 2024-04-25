MangaShop app build with NestJS and Svelte

Existing features:

- user authentication using JWT
- filtering mangas by genre and price range
- searching mangas by title
- cart persistance between logouts
- orders page with summary of all given user created orders
- reviewing mangas

How to run:

1.  change .env.example file in server folder to .env
2.  open MangaShop folder in terminal and run:
    - docker-compose up -d
    - docker exec -it nestjs-app sh -c "npm run typeorm migration:run"
3.  app is accessible on localhost:8080
