import './assets/scss/style.scss'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'swiper/swiper-bundle.css'

import 'swiper/css' // Swiper core CSS
import 'swiper/css/navigation' // Navigation 필요 시
import 'swiper/css/pagination' // Pagination 필요 시
import 'swiper/css/scrollbar' // Scrollbar 필요 시

import { OhVueIcon, addIcons } from 'oh-vue-icons'
import { FaFlag, RiZhihuFill, MdLocalmovies } from 'oh-vue-icons/icons'
addIcons(FaFlag, RiZhihuFill, MdLocalmovies)

// FontAwesome 추가 부분 시작
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faStar as fasStar,
  faStarHalfAlt as fasStarHalfAlt,
  faClapperboard as fasClapperboard
} from '@fortawesome/free-solid-svg-icons'
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// 필요한 아이콘을 라이브러리에 추가
library.add(fasStar, fasStarHalfAlt, farStar, fasClapperboard)

// FontAwesome 아이콘을 글로벌 컴포넌트로 등록
const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
// FontAwesome 추가 부분 끝

app.component('v-icon', OhVueIcon)
app.use(router)
app.mount('#app')
