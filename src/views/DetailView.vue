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

    <section class="panel recommendations scroller">
      <div id="recommendation_waypoint">
        <h3 dir="auto">추천</h3>
        <div id="recommendation_scroller" class="scroller_wrap should_fade is_hidden">
          <div class="scroller">
            <div
              v-for="recommendation in recommendations"
              :key="recommendation.id"
              class="item mini backdrop mini_card"
            >
              <div class="image_content glyphicons_v2 picture grey backdrop no_image_holder">
                <a
                  :href="'/movie/' + recommendation.id"
                  :title="recommendation.title"
                  :alt="recommendation.title"
                >
                  <img
                    loading="lazy"
                    class="backdrop w-full"
                    :src="
                      'https://image.tmdb.org/t/p/w250_and_h141_face/' +
                      recommendation.backdrop_path
                    "
                    :srcset="
                      'https://image.tmdb.org/t/p/w250_and_h141_face/' +
                      recommendation.backdrop_path +
                      ' 1x, https://image.tmdb.org/t/p/w500_and_h282_face/' +
                      recommendation.backdrop_path +
                      ' 2x'
                    "
                    :alt="recommendation.title"
                  />
                  <div class="meta">
                    <span class="release_date">
                      <span class="glyphicons_v2 calendar"></span>
                      {{ recommendation.release_date }}
                    </span>
                    <span class="buttons">
                      <span class="glyphicons_v2 star right rating"></span>
                      <span
                        class="glyphicons_v2 heart favourite list_action"
                        data-media-type="movie"
                      ></span>
                      <span
                        class="glyphicons_v2 bookmark watchlist list_action"
                        data-media-type="movie"
                      ></span>
                    </span>
                  </div>
                </a>
              </div>
              <p class="movie flex">
                <a
                  class="title"
                  :href="'/movie/' + recommendation.id"
                  :title="recommendation.title"
                  :alt="recommendation.title"
                >
                  <bdi>{{ recommendation.title }}</bdi>
                </a>
                <span class="vote_average"
                  >{{ recommendation.vote_average }}<span class="percent">%</span></span
                >
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
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
const apikey = import.meta.env.VITE_TMDB_API_KEY

const mainTrailer = ref(null)
const fullStars = ref(0)
const halfStar = ref(false)
const emptyStars = ref(0)

const fetchMovieDetails = async () => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${route.params.id}?api_key=${apikey}&append_to_response=release_dates,credits,videos,images,recommendations&language=ko-KR`
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
    if (trailers.value.length > 0) {
      mainTrailer.value = trailers.value[0]
    }

    // 추천 동영상 정보
    recommendations.value = response.data.recommendations.results

    // 평점을 별점으로 변환
    calculateStars(response.data.vote_average * 10) // API의 평점은 10점 만점이므로 100점 만점으로 변환
  } catch (error) {
    console.log('Error fetching movie details:', error)
    movie.value = {
      title: 'Error loading data',
      overview: 'There was an error fetching the movie details.',
      release_date: '-',
      runtime: '-',
      certification: '-',
      poster_path: null
    }
    cast.value = []
    trailers.value = []
    recommendations.value = []
  }
}

const calculateStars = (percent) => {
  const stars = percent / 20 // 별점은 5점 만점이므로 20으로 나눔
  fullStars.value = Math.floor(stars)
  halfStar.value = stars % 1 >= 0.5
  emptyStars.value = 5 - fullStars.value - (halfStar.value ? 1 : 0)
}

const goBack = () => {
  router.back()
}

onMounted(fetchMovieDetails)
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
    font-size: 2rem;
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
  background-color: #333;
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

.scroller_wrap {
  overflow-x: auto;
}

.h_scroller {
  display: flex;
  gap: 1rem;
}

.scroller {
  display: flex;
  gap: 1rem;
}

.item {
  flex: 0 0 auto;
  width: 250px;
}

.backdrop {
  width: 100%;
  height: 141px;
  object-fit: cover;
  border-radius: 10px;
}

.movie.flex {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 0.5rem;
}

.meta {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
}

.meta .release_date {
  display: flex;
  align-items: center;
}

.meta .buttons {
  display: flex;
  gap: 0.5rem;
}

.movie .title {
  font-weight: bold;
  color: #fff;
  text-decoration: none;
}

.movie .vote_average {
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
