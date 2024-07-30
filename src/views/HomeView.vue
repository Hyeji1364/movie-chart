<template>
  <HeaderSection />

  <main id="main" role="main">
    <!-- 배너 슬라이더 -->
    <div class="banner" v-if="currentBannerMovie">
      <router-link :to="'/movie/' + currentBannerMovie.id">
        <div class="banner__image-container">
          <img
            :src="getImageSrc(currentBannerMovie.backdrop_path)"
            :alt="currentBannerMovie.title"
            class="banner__image"
          />
        </div>
      </router-link>
    </div>

    <div class="view__inner container">
      <section class="view__card style1">
        <h3>최신 영화</h3>
        <div class="card">
          <ul>
            <li v-for="movie in latestMovies" :key="movie.id">
              <div class="card__image">
                <img :src="getImageSrc(movie.poster_path)" :alt="movie.title" />
                <div class="card__hover">
                  <button @click="playTrailer(movie)">예고편</button>
                  <router-link :to="'/movie/' + movie.id">상세보기</router-link>
                </div>
              </div>
              <div class="card__details">
                <span>{{ movie.title }}</span>
              </div>
            </li>
          </ul>
        </div>
      </section>
      <section class="view__card style1">
        <h3>추천 영화</h3>
        <div class="card">
          <ul>
            <li v-for="movie in popularMovies" :key="movie.id">
              <div class="card__image">
                <img :src="getImageSrc(movie.poster_path)" :alt="movie.title" />
                <div class="card__hover">
                  <button @click="playTrailer(movie)">예고편</button>
                  <router-link :to="'/movie/' + movie.id">상세보기</router-link>
                </div>
              </div>
              <div class="card__details">
                <span>{{ movie.title }}</span>
              </div>
            </li>
          </ul>
        </div>
      </section>
      <!-- 높은 평점의 인기 영화 섹션 -->
      <section class="view__card style1">
        <h3>높은 평점의 인기 영화</h3>
        <div class="card">
          <ul>
            <li v-for="movie in highRatedMovies" :key="movie.id">
              <div class="card__image">
                <img :src="getImageSrc(movie.poster_path)" :alt="movie.title" />
                <div class="card__hover">
                  <button @click="playTrailer(movie)">예고편</button>
                  <router-link :to="'/movie/' + movie.id">상세보기</router-link>
                </div>
              </div>
              <div class="card__details">
                <span>{{ movie.title }}</span>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </div>

    <!-- 예고편 모달 -->
    <div v-if="showTrailerModal" class="trailer-modal" @click="closeTrailerModal">
      <div class="trailer-content" @click.stop>
        <iframe
          width="800"
          height="450"
          :src="'https://www.youtube.com/embed/' + trailerKey"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
        <button @click="closeTrailerModal" class="close-button">닫기</button>
      </div>
    </div>
  </main>

  <FooterSection />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import HeaderSection from '@/components/HeaderSection.vue'
import FooterSection from '@/components/FooterSection.vue'

const latestMovies = ref([])
const popularMovies = ref([])
const highRatedMovies = ref([])
const bannerMovies = ref([])
const currentBannerMovie = ref(null)
const showTrailerModal = ref(false)
const trailerKey = ref('')
const apikey = import.meta.env.VITE_TMDB_API_KEY
const defaultImage = new URL('@/assets/img/notimg.png', import.meta.url).href

// 고화질 이미지 경로 반환 함수
const getImageSrc = (path) => {
  return path ? `https://image.tmdb.org/t/p/original/${path}` : defaultImage
}

const fetchMovies = async () => {
  try {
    const latestResponse = await axios.get(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${apikey}&page=1&language=ko-KR`
    )
    latestMovies.value = latestResponse.data.results

    const popularResponse = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=${apikey}&page=1&language=ko-KR`
    )
    popularMovies.value = popularResponse.data.results

    const highRatedResponse = await axios.get(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${apikey}&page=1&language=ko-KR`
    )
    highRatedMovies.value = highRatedResponse.data.results

    // 모든 영화 목록을 하나로 합친 후 랜덤 영화 선택
    const allMovies = [...latestMovies.value, ...popularMovies.value]
    bannerMovies.value = Array.from(
      { length: 8 },
      () => allMovies[Math.floor(Math.random() * allMovies.length)]
    )

    // 초기 배너 영화 설정
    currentBannerMovie.value = bannerMovies.value[0]
  } catch (error) {
    console.error('Error fetching movies:', error)
  }
}

// 5초마다 배너 영화 변경
const rotateBannerMovie = () => {
  let currentIndex = 0
  setInterval(() => {
    currentIndex = (currentIndex + 1) % bannerMovies.value.length
    currentBannerMovie.value = bannerMovies.value[currentIndex]
  }, 5000)
}

const playTrailer = async (movie) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${apikey}&language=ko-KR`
    )
    const trailer = response.data.results.find(
      (video) => video.type === 'Trailer' && video.site === 'YouTube'
    )
    if (trailer) {
      trailerKey.value = trailer.key
      showTrailerModal.value = true
    } else {
      alert('예고편을 찾을 수 없습니다.')
    }
  } catch (error) {
    console.error('Error fetching trailer:', error)
  }
}

const closeTrailerModal = () => {
  showTrailerModal.value = false
}

onMounted(() => {
  fetchMovies().then(() => {
    rotateBannerMovie()
  })
})
</script>

<style lang="scss">
body {
  margin: 0;
  font-family: 'SUITE-Regular', Arial, sans-serif;
  background-color: #1e1e1e;
  color: #fff;
  line-height: 1.6;
}

main {
  padding: 2rem 0;

  .banner {
    width: 100%;
    height: 600px; /* 높이를 약간 줄임 */
    margin-bottom: 2rem;
    position: relative;
    background-color: #000;

    .swiper {
      width: 100%;
      height: 100%;
    }

    .swiper-slide {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1.5rem;
      background: #000;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        background-color: #000;
      }
    }

    .banner__image-container {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;

      /* 이미지 양 옆을 자연스럽게 흐리게 하기 위한 그라데이션 추가 */
      &::before,
      &::after {
        content: '';
        position: absolute;
        top: 0;
        width: 20%; /* 그라데이션 영역을 더 넓게 설정 */
        height: 100%;
        z-index: 1;
        pointer-events: none;
      }

      &::before {
        left: 0;
        background: linear-gradient(
          to right,
          #000 0%,
          rgba(0, 0, 0, 0.75) 25%,
          rgba(0, 0, 0, 0) 50%
        );
      }

      &::after {
        right: 0;
        background: linear-gradient(
          to left,
          #000 0%,
          rgba(0, 0, 0, 0.75) 25%,
          rgba(0, 0, 0, 0) 50%
        );
      }
    }

    .banner__image {
      width: 100%;
      height: 100%;
      object-fit: contain; /* 이미지가 잘리지 않고 전체가 보이도록 함 */
    }

    .banner__image-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 50%;
      background: linear-gradient(to top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%);
      z-index: 2; /* 기존 ::before 요소 위에 배치 */
      pointer-events: none;
    }

    .banner__details {
      position: absolute;
      bottom: 20px;
      left: 20px;
      background: rgba(0, 0, 0, 0.5);
      color: #fff;
      padding: 1rem;
      border-radius: 5px;

      h2 {
        margin: 0;
        font-size: 1.5rem;
      }

      p {
        margin: 0.5rem 0 0;
      }
    }
  }
}

.view__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.view__card {
  margin-top: 50px;

  h3 {
    font-family: var(--fontS);
    font-weight: 300;
    margin-bottom: 20px;
    font-size: 26px;
    color: #e0e0e0;
    border-bottom: 2px solid #444;
    padding-bottom: 10px;
  }
}

.card ul {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  padding: 0;
  list-style: none;
}

.card li {
  background-color: #292929;
  border-radius: 5px;
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
    position: relative;

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

    .card__hover {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: rgba(0, 0, 0, 0.7);
      opacity: 0;
      transition: opacity 0.3s;

      button,
      a {
        margin: 0.5rem;
        padding: 0.75rem 1.5rem;
        background-color: #e50914;
        color: #fff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        text-decoration: none;
        font-family: 'SUITE-Regular';
        font-size: 1rem;
      }
    }

    &:hover .card__hover {
      opacity: 1;
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

.trailer-modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
}

.trailer-content {
  position: relative;
  background: #000;
  padding: 1rem;
  border-radius: 10px;
}

.trailer-content iframe {
  width: 800px;
  height: 450px;
  border-radius: 10px;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #e50914;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'SUITE-Regular', Arial, sans-serif;
  font-size: 1rem;
  font-weight: 700;
}

footer {
  padding: 1rem;
  text-align: center;
  background-color: #000;
}
</style>
