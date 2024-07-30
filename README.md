# 🎬 API를 이용한 영화 소개 사이트
- The movie

<br>

# 📑 프로젝트 소개
`The movie`는 TMDB의 api를 이용한 영화 소개 사이트입니다. 최신 영화부터 추천영화, 높은 평점의 인기영화를 볼 수 있습니다. <br>
상세페이지에서는 영화 정보 및 출연진 정보, 관련 영화를 볼 수 있습니다.

<br>

# 🏷️ 사용한 기술 & 스택
- Vue : Vue를 이용해 영화 정보를 가져오고, 예고편 및 출연진 정보, 관련 영화 등을 상세페이지에 업로드함
- Vercel : 완성한 결과물을 다른 사람들도 볼 수 있게 Vercel에서 웹사이트로 링크화함

<br >

# 🎥 주요 기능
- 메인페이지 : 최신 영화 / 추천 영화 / 높은 평점의 인기영화를 카테고리화하여 제공
- 영화별 예고편과 상세보기 기능 제공
- 상세페이지 : 개봉연도, 관람등급, 러닝타임, 평점, 줄거리, 출연진 제공
- 영화별 관련 영화 바로 가기

<br>

# ✨사이트 프리뷰
![Vite-App](https://github.com/user-attachments/assets/b4b0f9c3-ecb9-4194-bf31-3dca77701a13)
최신영화부터 추천영화, 높은 평점의 인기영화까지 모두 제공

<br>

![image](https://github.com/user-attachments/assets/7b50c112-035a-4efb-8ef3-8a938d827e78)
영화 포스터에 마우스 오버하면 포스터가 살짝 어두워지며 영화의 `예고편` 및 `상세보기` 버튼이 생김

<br>

![image](https://github.com/user-attachments/assets/65ac9f39-2885-41fa-9ad6-1dae344486bd)
- 예고편 Click :  팝업창에서 예고편 바로 감상 가능

<br>

![image](https://github.com/user-attachments/assets/881ed721-f679-4a83-9511-02161cfef23e)
- 상세보기 Click : 영화 관련 정보 제공
- 개봉연도 / 관람등급 / 러닝타임
- 줄거리
- 영화 출연진, 관련 영화 - 가로로 스크롤하며 볼 수 있음

<br>

# 🛠️ 트러블 슈팅
### Vercel '관련영화' 오류메시지
- 문제점 : Vercel에서 웹페이지를 링크화 한 후, 상세페이지의 '관련 영화'를 클릭하면 404 NOT FOUND 오류가 뜨는 것을 확인
- 해결책 : Vercel에서 import시에 `Framework Preset`을 `Vite`가 아닌 `Vue.js`로 설정
- 결과 : 영화 상세페이지 관련 영화 포스터를 클릭하면 관련 영화 상세페이지로 바로 이동이 잘 되는것을 확인


--- 

## 설치

```
npm install sass
npm install gsap
```

## 실행

```
npm run dev
```

### scoped

중복방지

### 아이콘 설치

```
npm install oh-vue-icons
```

### 빌드 시키기

```
npm run build
```

메인, add아이콘에 추가, HeaderSection.vue소문자로 바꿔서 추가
