---
layout: default
---

<div class="container-lg px-3 my-5">
  <style>
    .site-header { display: none !important; }
  </style>
  <div style="text-align: center; margin-bottom: 60px;">
    <img src="logo.jpg" alt="Logo" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; box-shadow: 0 8px 24px rgba(0,0,0,0.1); margin-bottom: 20px;">
    <h1 style="font-weight: 300; margin-bottom: 10px;">欢迎来到我的博客</h1>
    <p style="color: #586069; font-size: 1.1em;">这里是我记录技术、生活和随想的地方。</p>
  </div>

  <div class="posts-list" style="max-width: 800px; margin: 0 auto;">
    <h2 style="font-weight: 400; border-bottom: 1px solid #eaecef; padding-bottom: 10px; margin-bottom: 30px; color: #24292e;">最新文章</h2>
    
    {% for post in site.posts %}
    <div style="margin-bottom: 40px;">
      <h3 style="margin-bottom: 8px; font-weight: 600;">
        <a href="{{ post.url }}" style="color: #0366d6; text-decoration: none;">{{ post.title }}</a>
      </h3>
      <div style="color: #586069; font-size: 14px; margin-bottom: 12px;">
        {{ post.date | date: "%Y-%m-%d" }}
      </div>
      <div style="color: #444; line-height: 1.6;">
        {{ post.excerpt | strip_html | truncate: 200 }}
      </div>
      <div style="margin-top: 10px;">
        <a href="{{ post.url }}" style="font-size: 14px; font-weight: 600; color: #0366d6; text-decoration: none;">阅读全文 &rarr;</a>
      </div>
    </div>
    {% endfor %}
  </div>
</div>
