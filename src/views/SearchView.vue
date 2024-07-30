<template>
  <div>
    <HeaderSection />
    <main id="main" role="main">
      <div class="view__inner container">
        <section class="view__card style1">
          <h3>검색 결과</h3>
          <div v-if="movies.length">
            <ul class="search-results">
              <li v-for="movie in movies" :key="movie.id">
                <router-link :to="'/movie/' + movie.id">
                  <div class="card__image">
                    <img :src="getImageSrc(movie.poster_path)" :alt="movie.title" />
                  </div>
                  <div class="card__details">
                    <span>{{ movie.title }}</span>
                  </div>
                </router-link>
              </li>
            </ul>
          </div>
          <div v-else>
            <p>검색 결과가 없습니다.</p>
          </div>
        </section>
      </div>
    </main>
    <FooterSection />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import HeaderSection from '@/components/HeaderSection.vue'
import FooterSection from '@/components/FooterSection.vue'

const route = useRoute()
const movies = ref([])
const apikey = import.meta.env.VITE_TMDB_API_KEY
const defaultImage = new URL('@/assets/img/notimg.png', import.meta.url).href

const getImageSrc = (path) => {
  return path ? `https://image.tmdb.org/t/p/w500/${path}` : defaultImage
}

const fetchMovies = async (query) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${apikey}&query=${query}&language=ko-KR`
    )
    movies.value = response.data.results
  } catch (error) {
    console.error('Error fetching search results:', error)
  }
}

watch(
  () => route.query.q,
  (newQuery) => {
    if (newQuery) {
      fetchMovies(newQuery)
    }
  },
  { immediate: true }
)
</script>

<style lang="scss">
.view__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.view__card {
  margin-top: 50px;

  h3 {
    font-family: var(--fontJ);
    font-weight: 500;
    margin-bottom: 20px;
    font-size: 26px;
    color: #e0e0e0;
    border-bottom: 2px solid #444;
    padding-bottom: 10px;
  }
}

.search-results {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  padding: 0;
  list-style: none;
}

.search-results li {
  background-color: #292929;
  border-radius: 15px;
  overflow: hidden;
  text-align: center;
  transition:
    transform 0.3s,
    box-shadow 0.3s;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  .card__image {
    width: 100%;
    height: 300px;
    overflow: hidden;
    border-bottom: 1px solid #444;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition:
        transform 0.3s,
        filter 0.3s;
    }

    &:hover img {
      transform: scale(1.1);
      filter: brightness(0.8);
    }
  }

  .card__details {
    padding: 1rem;
    background-color: #292929;
    transition: background-color 0.3s;

    span {
      display: block;
      font-size: 1.2rem;
      font-weight: bold;
      color: #fff;
    }
  }
}
</style>
