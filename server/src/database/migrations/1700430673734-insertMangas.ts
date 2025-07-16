import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertMangas1700430673734 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO manga (manga_id, title, img_url, price, stock_quantity, author, description) VALUES
                                                                                                 (1, 'Blue Lock', 'https://uploads.mangadex.org/covers/b4668276-4b3e-49e0-98e7-fcc6841f7680/b3a74965-d4aa-4fb1-a2a5-c777eb82b475.jpg.256.jpg', 19.99, 20, 'Muneyuki Kaneshiro', 'Yoichi Isagi lost the opportunity to go to the national high school championships because he passed to his teammate who missed instead of shooting himself. Isagi is one of 300 U-18 strikers chosen by Jinpachi Ego, a man who was hired by the Japan Football Association after the 2018 FIFA World Cup, to guide Japan to winning the World Cup by destroying Japanese football. Ego''s plan is to isolate the 300 strikers into a prison-like institution called "Blue Lock", in order to create the world''s biggest "egotist"/striker, which has been lacking in Japanese football.'),
                                                                                                 (2, 'Jujutsu Kaisen', 'https://uploads.mangadex.org/covers/c52b2ce3-7f95-469c-96b0-479524fb7a1a/7dc752c3-8c90-468e-8c75-6903e38d7c7f.jpg.256.jpg', 19.99, 20, 'Gege Akutami', 'For some strange reason, Itadori Yuuji, despite his insane athleticism, would rather just hang out with the Occult Club. However, he soon finds out that the occult is as real as it gets when his fellow club members are attacked!

Meanwhile, the mysterious Fushiguro Megumi is tracking down a special-grade cursed object, and his search leads him to Itadori…'),
                                                                                                 (3, 'Chainsaw Man', 'https://uploads.mangadex.org/covers/a77742b1-befd-49a4-bff5-1ad4e6b0ef7b/fdf0d950-c72f-405b-9222-8b32a1f6e5ae.jpg.256.jpg', 19.99, 20, 'Tatsuki Fujimoto', 'Broke young man + chainsaw dog demon = Chainsaw Man!

The name says it all! Denji''s life of poverty is changed forever when he merges with his pet chainsaw dog, Pochita! Now he''s living in the big city and an official Devil Hunter. But he''s got a lot to learn about his new job and chainsaw powers!
'),
                                                                                                 (4, 'Oshi no Ko', 'https://uploads.mangadex.org/covers/296cbc31-af1a-4b5b-a34b-fee2b4cad542/d803d885-e371-4018-b332-4cbc5935177f.jpg.256.jpg', 19.99, 20, 'Aka Akasaka', 'The story begins with a beautiful girl, her perfectly fake smile, and the people who love her selfishly for it.

What transpires behind the scenes of the glittering showbiz industry? How far would you go for the sake of your beloved idol? What would you do if you found out reincarnation was real? The star of the show is Aquamarine Hoshino and the stage is but a mere facade. Will he manage to reach the climax before the world of glamour swallows him whole?
'),
                                                                                                 (5, 'Spy x Family', 'https://uploads.mangadex.org/covers/6b958848-c885-4735-9201-12ee77abcb3c/11c2207c-6886-43d2-90fd-c765127579c7.jpg.256.jpg', 24.99, 20, 'Tatsuya Endo', 'The master spy codenamed <Twilight> has spent most of his life on undercover missions, all for the dream of a better world. Yet one day he receives a particularly difficult order from command. For his mission, he must form a temporary family and start a new life?!

A Spy/Action/Comedy manga about a one-of-a-kind family!
'),
                                                                                                 (6, 'Tokyo Revengers', 'https://uploads.mangadex.org/covers/59b36734-f2d6-46d7-97c0-06cfd2380852/3676571a-9d2b-48e6-8639-d4591725759a.jpg.256.jpg', 19.99, 20, 'Ken Wakui', 'Takemichi is a 26-year-old unemployed virgin who learns that the girl he dated in middle school, the only girl he ever dated, has died. Then, after an accident he finds himself in a time leap back to his middle school years. He vows to change the future and save the girl, and to do that he aims to rise to the top of the Kanto region''s most brutal delinquent gang.'),
                                                                                                 (7, 'Solo Leveling', 'https://uploads.mangadex.org/covers/32d76d19-8a05-4db0-9fc2-e0b0648fe9d0/e90bdc47-c8b9-4df7-b2c0-17641b645ee1.jpg.256.jpg', 24.99, 20, 'Chu-Gong', '10 years ago, after “the Gate” that connected the real world with the monster world opened, some of the ordinary, everyday people received the power to hunt monsters within the Gate. They are known as “Hunters”. However, not all Hunters are powerful. My name is Sung Jin-Woo, an E-rank Hunter. I’m someone who has to risk his life in the lowliest of dungeons, the “World’s Weakest”. Having no skills whatsoever to display, I barely earned the required money by fighting in low-leveled dungeons… at least until I found a hidden dungeon with the hardest difficulty within the D-rank dungeons! In the end, as I was accepting death, I suddenly received a strange power, a quest log that only I could see, a secret to leveling up that only I know about! If I trained in accordance with my quests and hunted monsters, my level would rise. Changing from the weakest Hunter to the strongest S-rank Hunter!'),
                                                                                                 (8, 'Kage no Jitsuryokusha ni Naritakute', 'https://uploads.mangadex.org/covers/77bee52c-d2d6-44ad-a33a-1734c1fe696a/3e07507b-3425-48ee-baf0-83603a098487.jpg.256.jpg', 29.99, 20, 'Anri Sakano', 'Just like how everyone adored heroes in their childhood, a certain young man adored those powers hidden in shadows. Ninjas, rogues, shadowy mentor types, that sort of deal.
After hiding his strength and living the mediocre life of a NPC by day while undergoing frenzied training by night, he finally reincarnates into a different world and gains ultimate power.
The young man who is only pretending to be a power in the shadows… his subordinates who took him more seriously than he expected… and a giant organization in the shadows that gets accidentally trampled…
This is the story of a young boy who had adored powers in shadows possibly eventually reigning over the world of shadows in another world.'),
                                                                                                 (9, 'Sono Bisque Doll wa Koi wo Suru', 'https://uploads.mangadex.org/covers/aa6c76f7-5f5f-46b6-a800-911145f81b9b/b02d6932-b34d-41fb-86db-a71ecca42504.jpg.256.jpg', 19.99, 20, 'Fukuda Shinichi', 'Wakana Gojou is a fifteen year old high-school boy who was socially traumatized in the past due to his passions. That incident left a mark on him that made him into a social recluse. Until one day he had an encounter with Kitagawa who is a sociable gyaru, who is the complete opposite of him. They soon share their passions with one another which leads to their odd relationship.'),
                                                                                                 (10, 'Komi-san wa Komyushou Desu', 'https://uploads.mangadex.org/covers/a96676e5-8ae2-425e-b549-7f15dd34a6d8/f8f44329-1dd7-4301-9ec7-a4a76182e8eb.jpg.256.jpg', 19.99, 20, 'Oda Tomohito', 'Komi-san is a beautiful and admirable girl that no one can take their eyes off of. Almost the whole school sees her as the cold beauty that''s out of their league, but Tadano Hitohito knows the truth: she''s just really bad at communicating with others.

Komi-san, who wishes to fix this bad habit of hers, tries to improve it with the help of Tadano-kun by achieving her goal of having 100 friends.'),
                                                                                                 (11, 'Horimiya', 'https://uploads.mangadex.org/covers/a25e46ec-30f7-4db6-89df-cacbc1d9a900/04feed00-d919-4c72-b355-15b37555eb1e.jpg.256.jpg', 19.99, 20, 'Hagiwara Daisuke', 'Kyoko Hori is your average teenage girl… who has a side she wants no one else to ever discover. Then there''s her classmate Izumi Miyamura, your average glasses-wearing boy — who''s also a totally different person outside of school. When the two unexpectedly meet, they discover each other''s secrets, and a friendship is born.'),
                                                                                                 (12, 'Bungou Stray Dogs', 'https://uploads.mangadex.org/covers/3fba42cf-2ad6-4c30-a7ab-46cb8149208a/1bd684e2-9640-43d2-810e-6941f7fb0900.jpg.256.jpg', 39.99, 20, 'Asagiri Kafka', 'Nakajima Atsushi was kicked out of his orphanage, and now he has no place to go and no food. While he is standing by a river, on the brink of starvation, he rescues a man whimsically attempting suicide. That man is Dazai Osamu, and he and his partner Kunikida are members of a very special detective agency. They have supernatural powers, and deal with cases that are too dangerous for the police or the military. They''re tracking down a tiger that has appeared in the area recently, around the time Atsushi came to the area. The tiger seems to have a connection to Atsushi, and by the time the case is solved, it is clear that Atsushi''s future will involve much more of Dazai and the rest of the detectives!'),
                                                                                                 (13, 'Mieruko-chan', 'https://uploads.mangadex.org/covers/6670ee28-f26d-4b61-b49c-d71149cd5a6e/bd7e79a1-5a29-46e8-b402-765e7f01ff9b.jpg.256.jpg', 19.99, 20, 'Izumi Tomoki', 'All of a sudden, Miko is able to see grotesque monsters all around her; but no one else can. Rather than trying to run away or face them, she instead musters all of her courage and... ignores them. Join in on her day-to-day life as she keeps up her best poker face despite the supernatural goings-on.'),
                                                                                                 (14, 'Yofukashi no Uta', 'https://uploads.mangadex.org/covers/259dfd8a-f06a-4825-8fa6-a2dcd7274230/dabbfe60-f028-4dc7-9ccb-c38da7393d2f.jpg.256.jpg', 19.99, 20, 'Katsura Yukimaru', 'Unable to sleep or find true satisfaction in his daily life, Yamori Kou begins wandering the night streets. He encounters a strange girl who offers to help soothe his insomnia by sleeping beside him, but it is not merely a one-way exchange…'),
                                                                                                 (15, 'Attack on Titan', 'https://uploads.mangadex.org/covers/304ceac3-8cdb-4fe7-acf7-2b6ff7a60613/a329341c-6f8d-4776-9a83-156ed983b7a9.jpg.256.jpg', 29.99, 20, 'Hajime Isayama', 'Several hundred years ago, humans were nearly exterminated by Titans. Titans are typically several stories tall, seem to have no intelligence, devour human beings and, worst of all, seem to do it for pleasure rather than as a food source.
A small percentage of humanity survived by walling themselves in a city protected by extremely high walls, even taller than the biggest of Titans. Flash forward to the present and the southern district of Shinganshina has not seen a Titan in over 100 years.

Teenage boy Eren and his foster sister Mikasa witness something horrific as one of the outer district walls is damaged by a 60 meter (196.85 feet) Titan causing a breach in the wall. As the smaller Titans flood the city, the two kids watch in horror the tragic events that follow, as the Titans devour people unimpeded.

Eren vows that he will wipe out every single Titan and take revenge for all of mankind.'),
                                                                                                 (16, 'Gokushufudou: The Way of the House Husband', 'https://uploads.mangadex.org/covers/89daf9dc-075a-4aa5-873a-cc76bb287108/c49db3ba-8d0e-4596-92d0-84b3cdfe1e42.jpg.256.jpg', 24.99, 20, 'Kousuke Oono', 'Immortal Tatsu is an ex-yakuza who’s given up violence for making an honest man of himself - but is it still possible for a devoted stay-at-home husband to get into a few scrapes?'),
                                                                                                 (17, 'Darwin''s Game', 'https://uploads.mangadex.org/covers/b5f23eb3-7ff7-4a80-ae74-2686e65ccd57/577e2420-5bc9-4947-9b14-82c628283d6b.jpg.256.jpg', 24.99, 20, 'FLIPFLOPs', 'High school student Kaname Sudou receives an invitation from a classmate to play Darwin’s Game, a mobile game he has never heard of. However, as soon as he opens the application, a green snake suddenly pops out from his phone screen and bites his neck, leaving him unconscious. Waking up in the infirmary without any signs of a snake bite, he is told by the school to take the rest of the day off. Although he is puzzled by what has happened, he dismisses the surreal experience as a hallucination and boards the train home.
Unfortunately, his curiosity gets the better of him and he uses the application once again. As the application appears to be just like any other battle game, Kaname breathes out a sigh of relief and decides to start his first match. However, the pleasant surprise is short-lived, as his in-game opponent unexpectedly appears right in front of him and attempts to hunt him down with a knife.
As he desperately runs for his life, Kaname puts two and two together and realizes that Darwin’s Game is not an ordinary game, but rather, it’s a brutal fight for survival.')
    `);
    await queryRunner.query(`
    INSERT INTO manga_genre (manga_id, genre_id) VALUES
    -- Blue Lock (Action, Psychological)
    (1, 1),
    (1, 2),
    -- Jujutsu Kaisen (Action, Monsters)
    (2, 1),
    (2, 3),
    -- Chainsaw Man (Action, Monsters)
    (3, 1),
    (3, 3),
    -- Oshi no Ko (Romance, Comedy, Psychological)
    (4, 4),
    (4, 5),
    (4, 2),
    -- Spy x Family (Action, Comedy, Romance)
    (5, 1),
    (5, 5),
    (5, 4),
    -- Tokyo Revengers (Action, Thriller)
    (6, 1),
    (6, 6),
    -- Solo Leveling (Action, Monsters, Drama)
    (7, 1),
    (7, 3),
    (7, 7),
    -- Kage no Jitsuryokusha ni Naritakete (Action, Comedy, Drama)
    (8, 1),
    (8, 5),
    (8, 7),
    -- Sono Bisque Doll wa Koi wo Suru (Romance, Comedy)
    (9, 4),
    (9, 5),
    -- Komi-san wa Komyushou Desu (Romance, Comedy)
    (10, 4),
    (10, 5),
    -- Horimiya (Romance, Comedy)
    (11, 4),
    (11, 5),
    -- Bungou Stray Dogs (Action, Mafia, Drama)
    (12, 1),
    (12, 8),
    (12, 7),
    -- Mieruko-chan (Monsters, Psychological)
    (13, 3),
    (13, 2),
    -- Yofukashi no Uta (Romance, Psychological, Drama)
    (14, 4),
    (14, 2),
    (14, 7),
    -- Attack on Titan (Action, Monsters, Drama, Thriller)
    (15, 1),
    (15, 3),
    (15, 7),
    (15, 6),
    -- Gokushufudou: The Way of the House Husband (Comedy, Mafia)
    (16, 5),
    (16, 8),
    -- Darwin's Game (Monsters, Thriller, Psychological)
    (17, 3),
    (17, 6),
    (17, 2)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM manga`);
  }
}
