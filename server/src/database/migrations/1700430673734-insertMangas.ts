import { MigrationInterface, QueryRunner } from 'typeorm';
import { Manga } from '../../entities/manga.entity';
import { Genre } from '../../entities/genre.entity';
import { mangas } from '../starting-data';

export class InsertMangas1700430673734 implements MigrationInterface {
  private async mangaFactory(
    title: string,
    price: number,
    stock_quantity: number,
    author: string,
  ): Promise<Manga> {
    const url = 'https://api.mangadex.org/manga';
    const manga_url = 'https://uploads.mangadex.org/covers';

    let data = await fetch(
      `${url}?` +
        new URLSearchParams({
          title: `${title}`,
          'includes[]': 'cover_art',
        }),
    );
    let res = await data.json();
    let relationships = res.data[0].relationships;
    let filename = '';
    relationships.forEach((item) => {
      if (item.type === 'cover_art') {
        filename = item.attributes.fileName;
      }
    });
    let manga_id = res.data[0].id;

    let manga = new Manga();
    manga.title = title;
    manga.price = price;
    manga.stock_quantity = stock_quantity;
    manga.author = author;
    manga.img_url = `${manga_url}/${manga_id}/${filename}.256.jpg`;
    manga.description = res.data[0].attributes.description.en;
    manga.genres = [];
    return manga;
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const item of mangas) {
      let manga = await this.mangaFactory(item[0], item[1], item[2], item[3]);
      for (const name of item[4]) {
        let genre = await queryRunner.manager.findOne(Genre, {
          where: { name: name },
        });
        if (genre) {
          manga.genres.push(genre);
        }
      }
      await queryRunner.manager.save<Manga>(manga);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM manga`);
  }
}
