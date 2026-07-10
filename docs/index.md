---
layout: page
---

<script setup>
import { data as posts } from './posts.data.mts'
</script>

<div class="blog-container">
  <div class="blog-header">
    <h1>sandrone's Blog</h1>
    <p class="tagline">"Stay hungry, stay foolish."</p>
  </div>
  
  <div class="posts-grid">
    <a v-for="post in posts" :key="post.link" :href="post.link" class="post-card">
      <div class="post-meta">
        <span class="post-category">{{ post.category }}</span>
        <span class="post-date">{{ post.date }}</span>
      </div>
      <h2 class="post-title">{{ post.title }}</h2>
      <p class="post-desc">{{ post.description }}</p>
      <span class="read-more">阅读全文 →</span>
    </a>
  </div>
</div>

<style scoped>
.blog-container {
  position: relative;
  min-height: 100vh;
  padding: 60px 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.blog-header {
  text-align: center;
  margin-bottom: 60px;
}

.blog-header h1 {
height: 3rem;
  font-size: 2.8rem;
  line-height:2.8rem;
  font-weight: 700;
  background: linear-gradient(120deg, #bd34fe 30%, #41d1ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
  white-space: nowrap;
  overflow: visible;
}

.tagline {
  font-size: 1.2rem;
  color: var(--vp-c-text-2);
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
}

.post-card {
  display: block;
  padding: 24px;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  text-decoration: none;
  transition: all 0.3s ease;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  border-color: var(--vp-c-brand);
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.post-category {
  font-size: 0.75rem;
  color: var(--vp-c-brand);
  background: var(--vp-c-brand-soft);
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.post-date {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
}

.post-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 12px;
  line-height: 1.4;
}

.post-desc {
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin-bottom: 16px;
}

.read-more {
  font-size: 0.9rem;
  color: var(--vp-c-brand);
  font-weight: 500;
}

@media (max-width: 640px) {
  .blog-header h1 {
    font-size: 2rem;
  }
  
  .posts-grid {
    grid-template-columns: 1fr;
  }
}
</style>