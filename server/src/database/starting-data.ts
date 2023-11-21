const genres = [
  'Action',
  'Psychological',
  'Monsters',
  'Romance',
  'Comedy',
  'Thriller',
  'Drama',
  'Mafia',
];

type manga = [string, number, number, string, string[]];

const mangas: manga[] = [
  ['Blue Lock', 19.99, 20, 'Muneyuki Kaneshiro', ['Action', 'Psychological']],
  ['Jujutsu Kaisen', 19.99, 20, 'Gege Akutami', ['Action', 'Monsters']],
  ['Chainsaw Man', 19.99, 20, 'Tatsuki Fujimoto', ['Action', 'Monsters']],
  [
    'Oshi no Ko',
    19.99,
    20,
    'Aka Akasaka',
    ['Romance', 'Comedy', 'Psychological'],
  ],
  ['Spy x Family', 24.99, 20, 'Tatsuya Endo', ['Action', 'Comedy', 'Romance']],
  ['Tokyo Revengers', 19.99, 20, 'Ken Wakui', ['Action', 'Thriller']],
  ['Solo Leveling', 24.99, 20, 'Chu-Gong', ['Action', 'Monsters', 'Drama']],
  [
    'Kage no Jitsuryokusha ni Naritakute',
    29.99,
    20,
    'Anri Sakano',
    ['Action', 'Comedy', 'Drama'],
  ],
  [
    'Sono Bisque Doll wa Koi wo Suru',
    19.99,
    20,
    'Fukuda Shinichi',
    ['Romance', 'Comedy'],
  ],
  [
    'Komi-san wa Komyushou Desu',
    19.99,
    20,
    'Oda Tomohito',
    ['Romance', 'Comedy'],
  ],
  ['Horimiya', 19.99, 20, 'Hagiwara Daisuke', ['Romance', 'Comedy']],
  [
    'Bungou Stray Dogs',
    39.99,
    20,
    'Asagiri Kafka',
    ['Action', 'Mafia', 'Drama'],
  ],
  ['Mieruko-chan', 19.99, 20, 'Izumi Tomoki', ['Monsters', 'Psychological']],
  [
    'Yofukashi no Uta',
    19.99,
    20,
    'Katsura Yukimaru',
    ['Romance', 'Psychological', 'Drama'],
  ],
  [
    'Attack on Titan',
    29.99,
    20,
    'Hajime Isayama',
    ['Action', 'Monsters', 'Drama', 'Thriller'],
  ],
  [
    'Gokushufudou: The Way of the House Husband',
    24.99,
    20,
    'Kousuke Oono',
    ['Comedy', 'Mafia'],
  ],
  [
    "Darwin's Game",
    24.99,
    20,
    'FLIPFLOPs',
    ['Monsters', 'Thriller', 'Psychological'],
  ],
];

export { mangas, genres };
