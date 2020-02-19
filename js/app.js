//app.js

Vue.component('movie-item', {
  props: ['movie'],
  template: '<div class="col-sm-4 col-xs-12"><div class="card" style="width: 18rem;" id>' +
    '<img class="card-img-top" v:if="movie.image" v-bind:src="API_IMG + movie.image" v-bind:alt="movie.titre">' +
    '<div class="card-body">' +
    '<h5 class="card-title">{{ movie.titre }}</h5>' +
    '<p class="card-text">{{ movie.synopsis }}</p>' +
    '<a href="#" class="card-link">Vue</a>' +
    '<a href="#" class="card-link text-danger">Suppr</a>' +
    '</div>' +
    "<div class=\"card-footer text-muted\">Sortie :  {{ new Date(movie.date).toLocaleDateString('fr', { year: 'numeric', month: 'long', day: 'numeric' }) }}</div>" +
    '</div></div>'
});

var app = new Vue({
  el: '#app',
  data: {
    apiImg: API_IMG,
    message: 'Movies2Watch',
    search: '',
    movies: [],
    results: []
  },
  methods: {
    /**
     * Permet d'ajouter un film dans la liste
     * @param {*} e 
     */
    addMovie: function (e) {
      let idMovie = e.target.id;
      axios({
        method: 'get',
        url: API_MDB + '/movie/' + idMovie,
        params: {
          language: 'fr',
          api_key: '7afd664dc7f4ac326fb4da1f35ecbb8e'
        }
      }).then(response => {
        let data = response.data;
        if (data) {
          m = new Movie(data.title, data.release_date, data.overview, data.poster_path);
          axios({
            method: 'post',
            url: API_M2W + '/movies',
            data: {
              "titre": m.titre,
              "dateSortie": m.date,
              "synopsis": m.description.slice(0, 300)+'...',
              "realisateur": "string",
              "note": 0,
              "vue": false,
              "image": m.image
            }
          });
          this.recupererMovies();
        }
      });
    },
    /**
     * Permet de rechercher un film dans l'API de TMDB
     * @param {*} e 
     */
    searchMovie(e) {
      let query = e.target.value;
      if (query.length >= 2) {
        axios({
          method: 'get',
          url: API_MDB + '/search/movie',
          params: {
            query: query,
            language: 'fr',
            api_key: '7afd664dc7f4ac326fb4da1f35ecbb8e'
          }
        }).then(response => {
          let data = response.data;
          if (data.total_results >= 1) {
            this.results = data.results;
          }
        });
      }
    },
    /**
     * Permet de récupérer les films de notre liste
     * @param {*} e 
     */
    recupererMovies() {
      axios
      .get(API_M2W + '/movies')
      .then(response => {        
        if (response.status == 200) {
          let data = response.data;
          let results = data['hydra:member'];
          results.forEach(element => {
            this.movies.push({
              id: element.id,
              titre: element.titre,
              date: element.dateSortie,
              synopsis: element.synopsis,
              vue: element.vue,
              image: element.image
            });
          });
        }
      });
    }
  },
  mounted() {
    this.recupererMovies()
  }
})