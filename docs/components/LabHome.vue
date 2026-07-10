<script setup>
import { data as posts } from '../posts.data.mts'

const CATEGORY_THEME = {
  '技术分享': { accent: '#41d1ff', bg: 'rgba(65, 209, 255, 0.12)', border: 'rgba(65, 209, 255, 0.28)' },
  '生活随想': { accent: '#c9a6ff', bg: 'rgba(189, 52, 254, 0.14)', border: 'rgba(189, 52, 254, 0.3)' },
}
const DEFAULT_THEME = { accent: '#f5b25a', bg: 'rgba(245, 178, 90, 0.12)', border: 'rgba(245, 178, 90, 0.28)' }

function themeOf(category) {
  return CATEGORY_THEME[category] || DEFAULT_THEME
}

function pad(n) {
  return String(n).padStart(2, '0')
}

function cardStyle(post, i) {
  const t = themeOf(post.category)
  return {
    '--i': i,
    '--accent': t.accent,
    '--accent-bg': t.bg,
    '--accent-border': t.border,
  }
}
</script>

<template>
  <div class="lab-home">
    <header class="hero">
      <span class="hero-bracket bracket-tl" aria-hidden="true" />
      <span class="hero-bracket bracket-br" aria-hidden="true" />

      <div class="hero-frame">
        <div class="term-bar">
          <span class="term-dots" aria-hidden="true">
            <span class="term-dot" style="--c: #ff5f57" />
            <span class="term-dot" style="--c: #febc2e" />
            <span class="term-dot" style="--c: #28c840" />
          </span>
          <span class="term-path">sandrone@lab:~ $ whoami</span>
          <span class="term-status">
            <span class="term-status-dot" aria-hidden="true" />
            online
          </span>
        </div>

        <div class="hero-inner">
          <div class="hero-top">
            <span class="lab-kicker">
              <span class="lab-dot" aria-hidden="true" />
              Sandrone Lab
            </span>
            <span class="hero-meta">public notes</span>
          </div>
          <h1 class="hero-title">
            <span class="title-line">Welcome to</span>
            <span class="title-main">Sandrone Lab</span>
          </h1>
          <p class="tagline">
            <span class="tagline-mark" aria-hidden="true" />
            Cannot Create, Do Not Understand
            <span class="cursor-blink" aria-hidden="true" />
          </p>
          <div class="hero-rule" aria-hidden="true">
            <span class="rule-line" />
            <span class="rule-cap">experiments · notes · builds</span>
            <span class="rule-line" />
          </div>
        </div>
      </div>
    </header>

    <section class="feed" aria-label="Lab notes">
      <div class="feed-head">
        <h2 class="feed-title">
          <span class="feed-prompt" aria-hidden="true">$</span>
          ls ./notes
        </h2>
        <p class="feed-count">[ {{ posts.length }} entries ]</p>
      </div>
      <div class="posts-grid">
        <a
          v-for="(post, i) in posts"
          :key="post.link"
          :href="post.link"
          class="post-card"
          :style="cardStyle(post, i)"
        >
          <span class="card-id" aria-hidden="true">{{ pad(i + 1) }}</span>
          <div class="card-glow" aria-hidden="true" />
          <div class="post-meta">
            <span class="post-category">
              <span class="post-category-dot" aria-hidden="true" />
              {{ post.series ? `${post.category} · ${post.series}` : post.category }}
            </span>
            <span class="post-date">{{ post.date }}</span>
          </div>
          <h3 class="post-title">{{ post.title }}</h3>
          <p class="post-desc">{{ post.description }}</p>
          <span class="read-more">
            Open note
            <span class="read-arrow" aria-hidden="true">→</span>
          </span>
        </a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.lab-home {
  position: relative;
  min-height: 100dvh;
  max-width: 1120px;
  margin: 0 auto;
  padding: clamp(48px, 8vw, 96px) clamp(20px, 4vw, 32px) 96px;
}

.hero {
  position: relative;
  padding: 14px;
  margin-bottom: clamp(48px, 8vw, 80px);
}

.hero-bracket {
  position: absolute;
  width: 22px;
  height: 22px;
  opacity: 0.6;
  pointer-events: none;
}

.bracket-tl {
  top: 0;
  left: 0;
  border-top: 2px solid rgba(65, 209, 255, 0.55);
  border-left: 2px solid rgba(65, 209, 255, 0.55);
}

.bracket-br {
  bottom: 0;
  right: 0;
  border-bottom: 2px solid rgba(189, 52, 254, 0.55);
  border-right: 2px solid rgba(189, 52, 254, 0.55);
}

.hero-frame {
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 24px 48px rgba(0, 0, 0, 0.18);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  overflow: hidden;
}

.term-bar {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 20px;
  background: rgba(0, 0, 0, 0.22);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.term-dots {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.term-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--c);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.18);
}

.term-path {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.72rem;
  letter-spacing: 0.01em;
  color: rgba(235, 235, 245, 0.42);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.term-status {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  flex-shrink: 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(52, 211, 153, 0.85);
}

.term-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #34d399;
  box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.55);
  animation: pulse-dot 2.4s ease-out infinite;
}

.hero-inner {
  position: relative;
  padding: clamp(28px, 4vw, 40px) clamp(24px, 4vw, 36px);
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.028) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.028) 1px, transparent 1px);
  background-size: 28px 28px;
}

.hero-inner::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 60% 80% at 0% 0%, rgba(189, 52, 254, 0.12), transparent 55%),
    radial-gradient(ellipse 50% 60% at 100% 100%, rgba(65, 209, 255, 0.1), transparent 50%);
  pointer-events: none;
}

.hero-top {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 28px;
}

.lab-kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px 6px 10px;
  font-size: 0.72rem;
  font-weight: 650;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.88);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
}

.lab-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #41d1ff;
  box-shadow: 0 0 0 0 rgba(65, 209, 255, 0.55);
  animation: pulse-dot 2.4s ease-out infinite;
}

@keyframes pulse-dot {
  0% {
    box-shadow: 0 0 0 0 rgba(65, 209, 255, 0.55);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(65, 209, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(65, 209, 255, 0);
  }
}

.hero-meta {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  color: rgba(235, 235, 245, 0.42);
}

.hero-title {
  position: relative;
  margin: 0 0 20px;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.05;
}

.title-line {
  display: block;
  margin-bottom: 6px;
  font-size: clamp(1rem, 2.2vw, 1.15rem);
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(235, 235, 245, 0.55);
}

.title-main {
  display: block;
  font-size: clamp(2.4rem, 7vw, 3.75rem);
  background: linear-gradient(115deg, #e9d5ff 0%, #bd34fe 38%, #41d1ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.tagline {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 28px;
  max-width: 36rem;
  font-size: clamp(1.05rem, 2.2vw, 1.25rem);
  font-weight: 500;
  letter-spacing: 0.02em;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.86);
}

.tagline-mark {
  flex-shrink: 0;
  width: 3px;
  height: 1.15em;
  border-radius: 2px;
  background: linear-gradient(180deg, #bd34fe, #41d1ff);
}

.cursor-blink {
  display: inline-block;
  width: 2px;
  height: 1.1em;
  margin-left: 2px;
  background: #41d1ff;
  animation: blink 1.1s steps(1) infinite;
}

@keyframes blink {
  0%,
  49% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0;
  }
}

.hero-rule {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
}

.rule-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.04));
}

.hero-rule .rule-line:last-child {
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.18));
}

.rule-cap {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.7rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(235, 235, 245, 0.4);
  white-space: nowrap;
}

.feed-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
  padding: 0 4px;
}

.feed-title {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin: 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.8rem;
  font-weight: 650;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.78);
}

.feed-prompt {
  color: #41d1ff;
}

.feed-count {
  margin: 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.75rem;
  color: rgba(235, 235, 245, 0.4);
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
  gap: 16px;
}

.post-card {
  --i: 0;
  --accent: #41d1ff;
  --accent-bg: rgba(65, 209, 255, 0.12);
  --accent-border: rgba(65, 209, 255, 0.28);
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 220px;
  padding: 22px 22px 20px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 22px 22px;
  background-color: rgba(37, 37, 41, 0.55);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 8px 24px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  text-decoration: none;
  overflow: hidden;
  transition:
    transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.35s ease,
    box-shadow 0.35s ease;
  animation: card-in 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: calc(var(--i) * 45ms);
}

.post-card::before,
.post-card::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  opacity: 0;
  transition: opacity 0.3s ease, transform 0.3s ease;
  pointer-events: none;
}

.post-card::before {
  top: 10px;
  left: 10px;
  border-top: 2px solid var(--accent);
  border-left: 2px solid var(--accent);
  transform: translate(4px, 4px);
}

.post-card::after {
  bottom: 10px;
  right: 10px;
  border-bottom: 2px solid var(--accent);
  border-right: 2px solid var(--accent);
  transform: translate(-4px, -4px);
}

.post-card:hover::before,
.post-card:hover::after {
  opacity: 0.85;
  transform: translate(0, 0);
}

@keyframes card-in {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-id {
  position: absolute;
  right: 4px;
  bottom: -14px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 76px;
  font-weight: 700;
  line-height: 1;
  color: var(--accent);
  opacity: 0.07;
  pointer-events: none;
  user-select: none;
  transition: opacity 0.35s ease;
}

.post-card:hover .card-id {
  opacity: 0.14;
}

.card-glow {
  position: absolute;
  inset: -40% auto auto -20%;
  width: 70%;
  height: 70%;
  background: radial-gradient(circle, color-mix(in srgb, var(--accent) 45%, transparent), transparent 65%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.post-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent-border);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 18px 36px rgba(0, 0, 0, 0.22),
    0 0 0 1px color-mix(in srgb, var(--accent) 16%, transparent);
}

.post-card:hover .card-glow {
  opacity: 1;
}

.post-card:focus-visible {
  outline: 2px solid #41d1ff;
  outline-offset: 3px;
}

.post-meta {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.post-category {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.68rem;
  font-weight: 650;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent);
  background: var(--accent-bg);
  border: 1px solid var(--accent-border);
  padding: 3px 8px;
  border-radius: 6px;
}

.post-category-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent);
  flex-shrink: 0;
}

.post-date {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.75rem;
  color: rgba(235, 235, 245, 0.42);
}

.post-title {
  position: relative;
  margin: 0 0 10px;
  font-size: 1.2rem;
  font-weight: 650;
  letter-spacing: -0.02em;
  line-height: 1.35;
  color: rgba(255, 255, 255, 0.94);
}

.post-desc {
  position: relative;
  flex: 1;
  margin: 0 0 18px;
  font-size: 0.92rem;
  line-height: 1.65;
  color: rgba(235, 235, 245, 0.62);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.read-more {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: auto;
  font-size: 0.84rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--accent);
  transition: gap 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.read-arrow {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.post-card:hover .read-more {
  gap: 10px;
}

.post-card:hover .read-arrow {
  transform: translateX(3px);
}

@media (max-width: 640px) {
  .hero-meta {
    display: none;
  }

  .term-path {
    display: none;
  }

  .posts-grid {
    grid-template-columns: 1fr;
  }

  .title-main {
    font-size: clamp(2.1rem, 10vw, 2.8rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .lab-dot,
  .term-status-dot,
  .cursor-blink,
  .post-card {
    animation: none;
  }

  .post-card,
  .post-card::before,
  .post-card::after,
  .read-more,
  .read-arrow,
  .card-glow,
  .card-id {
    transition: none;
  }

  .post-card:hover {
    transform: none;
  }
}
</style>
