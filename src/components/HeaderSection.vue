<template>
  <header id="header" role="banner">
    <div class="header__inner container">
      <font-awesome-icon :icon="['fas', 'clapperboard']" class="clapperboard-icon" />
      <h1 @click="goHome">The<span>Movie</span></h1>
      <div class="search">
        <input type="search" v-model="query" @keyup.enter="searchMovies" />
        <button @click="searchMovies">검색하기</button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const query = ref('')
const router = useRouter()

const searchMovies = () => {
  if (query.value.trim()) {
    router.push({ name: 'search', query: { q: query.value } })
  }
}

const goHome = () => {
  router.push({ name: 'home' })
}
</script>

<style lang="scss">
.header__inner {
  padding: 26px;
  display: flex;
  justify-content: space-between;
  align-items: center; /* 수직 가운데 정렬 추가 */

  .clapperboard-icon {
    font-size: 3rem; /* 아이콘 크기 증가 */
    margin-right: 20px; /* h1과의 거리 조정 */
  }

  h1 {
    font-family: 'theJamsil';
    text-align: center;
    line-height: 1.15;
    font-size: 26px;
    margin-right: 20px;
    cursor: pointer;
    span {
      display: block;
      font-size: 32.6px;
      font-weight: 900;
      color: var(--pointColor);
    }
  }

  .search {
    width: 100%;
    position: relative;
    input {
      background-color: var(--black300);
      border: 1px solid var(--black100);
      padding: 1rem;
      width: 100%;
      border-radius: 50px;
      color: white;
    }
    button {
      position: absolute;
      right: 30px;
      top: 14px;
      background-color: var(--black100);
      color: var(--black800);
      padding: 2px 10px;
      line-height: 1.2;
      border: 1px solid var(--black100);
      border-radius: 20px;
      font-family: 'SUITE-Regular';
      font-weight: 300;
      cursor: pointer;
    }
  }
}
</style>
