<template>
  <footer class="footer">
    <div class="footer__inner container">
      <div class="footer__links">
        <a href="#" class="footer__link">About</a>
        <a href="#" class="footer__link">Contact</a>
        <a href="#" class="footer__link">Terms of Use</a>
        <a href="#" class="footer__link">Privacy Policy</a>
      </div>
      <div class="footer__credits">
        <p>&copy; 2024 Hyeji1364@gmail.com. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: #141414;
  color: #ccc;
  padding: 20px 0;
  text-align: center;
}

.footer__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.footer__links {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 10px;
}

.footer__link {
  color: #ccc;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.footer__link:hover {
  color: #fff;
}

.footer__credits {
  font-size: 12px;
}
</style>
