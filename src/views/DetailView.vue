<template>
  <div v-if="movie" class="movie-details">
    <div class="header">
      <h1>{{ movie.title || '-' }}</h1>
      <div class="movie-meta">
        <span>{{ movie.release_date ? movie.release_date.split('-')[0] : '-' }}</span>
        <span>{{ movie.certification ? movie.certification + '세' : '-' }}</span>
        <span>{{ movie.runtime ? movie.runtime + '분' : '-' }}</span>
      </div>
      <div class="stars">
        <font-awesome-icon
          v-for="star in fullStars"
          :key="'full-' + star"
          icon="fas fa-star"
          class="full-star"
        />
        <font-awesome-icon v-if="halfStar" icon="fas fa-star-half-alt" class="half-star" />
        <font-awesome-icon
          v-for="star in emptyStars"
          :key="'empty-' + star"
          icon="far fa-star"
          class="empty-star"
        />
      </div>
      <div class="rating">{{ (movie.vote_average * 1).toFixed(1) }}</div>
    </div>

    <div v-if="mainTrailer" class="main-trailer">
      <iframe
        width="100%"
        height="500"
        :src="'https://www.youtube.com/embed/' + mainTrailer.key"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>

    <div class="content">
      <div class="poster">
        <img
          :src="
            movie.poster_path
              ? 'https://image.tmdb.org/t/p/w500/' + movie.poster_path
              : 'path/to/default/poster.jpg'
          "
          :alt="movie.title || 'No image available'"
        />
      </div>
      <div class="details">
        <p class="overview">{{ movie.overview || '-' }}</p>
        <button @click="goBack" class="back-button">뒤로 가기</button>
      </div>
    </div>

    <div class="additional-info">
      <h2>출연진</h2>
      <div class="cast-container-outer">
        <div class="cast-container">
          <div v-for="actor in cast" :key="actor.id" class="card">
            <div class="profile">
              <img
                :src="
                  actor.profile_path
                    ? 'https://image.tmdb.org/t/p/w138_and_h175_face' + actor.profile_path
                    : 'path/to/default/profile.jpg'
                "
                :alt="actor.name"
              />
            </div>
            <p>
              <a :href="'/person/' + actor.id">{{ actor.name }}</a>
            </p>
            <p class="character">{{ actor.character }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="additional-info">
      <h2>관련 영화</h2>
      <div class="recommendations-container-outer">
        <div class="recommendations-container">
          <div v-for="similarMovie in similarMovies" :key="similarMovie.id" class="card">
            <div class="profile">
              <a
                :href="'/movie/' + similarMovie.id"
                :title="similarMovie.title"
                :alt="similarMovie.title"
              >
                <img
                  loading="lazy"
                  :src="
                    'https://image.tmdb.org/t/p/w250_and_h141_face/' + similarMovie.backdrop_path
                  "
                  :alt="similarMovie.title"
                />
              </a>
            </div>
            <p>
              <a
                :href="'/movie/' + similarMovie.id"
                :title="similarMovie.title"
                :alt="similarMovie.title"
              >
                {{ similarMovie.title }}
              </a>
            </p>
            <p class="vote_average">
              {{ similarMovie.vote_average }}<span class="percent">%</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const movie = ref(null)
const cast = ref([])
const trailers = ref([])
const recommendations = ref([])
const similarMovies = ref([])
const relatedMovies = ref([])
const apikey = import.meta.env.VITE_TMDB_API_KEY
const account_id = '8016eb5b601e7aa0bd3e9e0579deeedd'

const mainTrailer = ref(null)
const fullStars = ref(0)
const halfStar = ref(false)
const emptyStars = ref(0)

const fetchMovieDetails = async () => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${route.params.id}?api_key=${apikey}&append_to_response=release_dates,credits,videos,recommendations,similar&language=ko-KR`
    )
    movie.value = response.data

    // 출연진 정보
    cast.value = response.data.credits.cast

    // 영화 인증 정보
    const releaseData = response.data.release_dates.results.find(
      (country) => country.iso_3166_1 === 'KR'
    )
    if (releaseData) {
      const certificationData = releaseData.release_dates.find((release) => release.certification)
      if (certificationData) {
        movie.value.certification = certificationData.certification
      }
    }

    // 예고편 정보
    trailers.value = response.data.videos.results.filter(
      (video) => video.type === 'Trailer' && video.site === 'YouTube'
    )

    // 첫 번째 예고편을 메인 예고편으로 설정
    mainTrailer.value = trailers.value.length > 0 ? trailers.value[0] : null

    // 추천 영화 정보
    recommendations.value = response.data.recommendations.results

    // 비슷한 영화 정보
    similarMovies.value = response.data.similar.results

    // 별점 계산
    const rating = movie.value.vote_average / 2
    fullStars.value = Math.floor(rating)
    halfStar.value = rating % 1 !== 0
    emptyStars.value = 5 - fullStars.value - (halfStar.value ? 1 : 0)
  } catch (error) {
    console.error('Error fetching movie details:', error)
  }
}

const fetchRelatedMovies = async () => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/account/${account_id}/rated/movies?api_key=${apikey}&language=ko-KR`
    )
    relatedMovies.value = response.data.results
  } catch (error) {
    console.error('Error fetching related movies:', error)
  }
}

onMounted(() => {
  fetchMovieDetails()
  fetchRelatedMovies()
})

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap');

body {
  margin: 0;
  font-family: 'Noto Sans KR', sans-serif;
  background-color: #000;
  color: #fff;
}

.movie-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

.main-trailer {
  width: 100%;
  margin: 1rem 0 2rem;
}

.main-trailer iframe {
  border-radius: 10px;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.movie-meta {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  margin-bottom: 1rem;

  span {
    background: #444;
    padding: 0.5rem 1rem;
    border-radius: 5px;
  }
}

.stars {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;

  .full-star,
  .half-star,
  .empty-star {
    color: #ffd700;
    margin-right: 0.25rem;
  }

  .empty-star {
    color: #444;
  }
}

.rating {
  font-size: 0.9rem;
  color: #ccc;
}

.content {
  display: flex;
  gap: 2rem;
  max-width: 1200px;
  width: 100%;
  margin-bottom: 5vh;
}

.poster {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.poster img {
  width: 100%;
  max-width: 400px;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
}

.details {
  flex: 2;
}

.overview {
  margin-bottom: 2rem;
}

.additional-info {
  margin-bottom: 2rem;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    font-weight: 700;
  }
}

.back-button {
  background-color: #e50914;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 1rem;
  font-weight: 700;
}

.cast-container-outer {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.cast-container {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 1rem;
  max-width: 1200px;
}

.cast-container-full {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.card {
  flex: 0 0 auto;
  text-align: center;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  padding: 1rem;
}

.card img {
  width: 138px;
  height: 175px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 0.5rem;
}

.card p {
  margin: 0.5rem 0;
}

.more-card {
  text-align: center;
  color: #fff;
  background-color: #444;
  border-radius: 10px;
  padding: 1rem;
}

.more-card button {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 700;
}

.recommendations {
  margin-top: 2rem;
}

.recommendations-container-outer {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.recommendations-container {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 1rem;
  max-width: 1200px;
}

.card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 0.5rem;
}

.vote_average {
  font-size: 0.9rem;
  color: #ccc;
}

/* 스크롤바 스타일 */
::-webkit-scrollbar {
  height: 10px;
  width: 7px;
  background-color: #222;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to right, #e9b7b7, #e8e2e2);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #ff0a16;
}

::-webkit-scrollbar-track {
  background-color: #444;
  border-radius: 5px;
}
</style>
