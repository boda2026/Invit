const CONFIG = {
  names: {
    bride: 'Mariana Ailin',
    groom: 'Pablo Matias',
    brideFullName: 'Mariana Ailin Limarino',
  },

  password: 'fernetazo',

  weddingDate: '2026-10-10T18:00:00-03:00',

  event: {
    timeline: [
      { time: '18:00', label: 'Civil' },
      { time: '19:30', label: 'Recepción' },
      { time: '20:00', label: 'Fiesta' },
    ],
    venue: {
      name: 'Country Altos de Carlos Paz',
      address: 'Av. Perito Moreno 1760',
      city: 'Villa Carlos Paz, Córdoba',
      mapsUrl: 'https://maps.app.goo.gl/qtxSwoMXrxTWdYDj7',
    },
  },

  dressCode: 'Cocktail · Semiformal',

  playlist: {
    spotifyUrl: 'https://open.spotify.com/playlist/7vgeaLq7H23qs4Ox2wvUUm',
    embedUrl: 'https://open.spotify.com/embed/playlist/7vgeaLq7H23qs4Ox2wvUUm',
    text: 'Ayudanos a pensar qué música no puede faltar para este día tan especial.',
    subtext: 'Si tu sugerencia no está en Spotify, no dudes en avisarnos por mensaje.',
  },

  gift: {
    alias: 'bodayfernet',
    holder: 'Mariana Ailin Limarino',
    text: 'Tu presencia es nuestro mejor regalo, pero si deseas acompañarnos con un regalo, puedes colaborar con nuestra luna de miel.',
  },

  rsvp: {
    deadline: '15 de julio de 2026',
    formUrl: 'https://forms.gle/sYidah81RkVCP72d6',
  },

  music: {
    src: 'assets/music.mp3',
    autoplay: false,
    fadeTime: 1500,
  },

  galleryImages: [
    { src: 'assets/photo-01.jpeg', alt: 'Mariana y Pablo' },
    { src: 'assets/photo-02.jpeg', alt: 'Mariana y Pablo' },
    { src: 'assets/photo-03.jpeg', alt: 'Mariana y Pablo' },
    { src: 'assets/photo-04.jpeg', alt: 'Mariana y Pablo' },
    { src: 'assets/photo-05.jpeg', alt: 'Mariana y Pablo' },
    { src: 'assets/photo-06.jpeg', alt: 'Mariana y Pablo' },
    { src: 'assets/photo-07.jpeg', alt: 'Mariana y Pablo' },
    { src: 'assets/photo-08.jpg', alt: 'Mariana y Pablo' },
    { src: 'assets/photo-09.jpg', alt: 'Mariana y Pablo' },
  ],

  particles: {
    count: 40,
    colors: ['#DABD9D', '#FEF9F3', '#ffffff'],
  },
};

export default CONFIG;
