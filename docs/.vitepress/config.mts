import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'
import footnote from 'markdown-it-footnote'

// 无 index.md 时的兜底显示名（优先读目录下 index.md 的 # 标题）
const fallbackNames: Record<string, string> = {
    tech: '技术分享',
    life: '生活随想'
}

// 忽略的目录（不进入侧边栏）
const IGNORE_DIRS = new Set(['images', 'assets', 'public', 'components'])

/** 读取 markdown 第一个一级标题 */
function readTitle(filePath: string): string | null {
    if (!fs.existsSync(filePath)) return null
    const content = fs.readFileSync(filePath, 'utf-8')
    const match = content.match(/^#\s+(.+)$/m)
    return match ? match[1].trim() : null
}

/** 目录显示名：index.md 的 # 标题 → 兜底表 → 文件夹名 */
function dirDisplayName(dirPath: string, dirName: string): string {
    return (
        readTitle(path.join(dirPath, 'index.md')) ||
        fallbackNames[dirName] ||
        dirName
    )
}

// 递归扫描目录，生成 VitePress 嵌套侧边栏
// 每个子目录若有 index.md：
//   - 侧边栏分组文案 = index.md 的 # 标题
//   - 点击分组可打开该 index 页面
//   - 同目录下其它 .md 作为子文章
function scanPosts(dir: string, baseLink: string = '/posts'): any[] {
    const items: any[] = []
    if (!fs.existsSync(dir)) return items

    const entries = fs
        .readdirSync(dir, { withFileTypes: true })
        .filter((e) => !e.name.startsWith('.'))
        .sort((a, b) => {
            if (a.isDirectory() !== b.isDirectory()) {
                return a.isDirectory() ? -1 : 1
            }
            return a.name.localeCompare(b.name)
        })

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)

        if (entry.isDirectory()) {
            if (IGNORE_DIRS.has(entry.name)) continue

            const childLink = `${baseLink}/${entry.name}`
            const subItems = scanPosts(fullPath, childLink)
            const indexPath = path.join(fullPath, 'index.md')
            const hasIndex = fs.existsSync(indexPath)

            // 既没有子文章、也没有 index 介绍页 → 跳过
            if (subItems.length === 0 && !hasIndex) continue

            const group: Record<string, any> = {
                text: dirDisplayName(fullPath, entry.name),
                collapsed: false,
                items: subItems
            }

            // 有 index.md 时，分组标题可点击，进入系列/分类介绍页
            if (hasIndex) {
                group.link = `${childLink}/`
            }

            items.push(group)
        } else if (entry.name.endsWith('.md') && entry.name !== 'index.md') {
            // index.md 不出现在子列表里，避免和分组标题重复
            const title =
                readTitle(fullPath) || entry.name.replace(/\.md$/, '')
            items.push({
                text: title,
                link: `${baseLink}/${entry.name.replace(/\.md$/, '')}`
            })
        }
    }

    return items
}

function getPostsSidebar() {
    const postsDir = path.resolve(__dirname, '../posts')
    return scanPosts(postsDir)
}

export default defineConfig({
    title: 'Sandrone Lab',
    description: 'Experiments, notes, and builds from Sandrone Lab',
    appearance: 'dark',
    markdown: {
        math: true,
        config: (md) => {
            md.use(footnote)
        }
    },
    head: [
        [
            'link',
            {
                rel: 'stylesheet',
                href: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css'
            }
        ]
    ],
    themeConfig: {
        nav: [
            { text: '首页', link: '/' },
            { text: '技术', link: '/posts/tech/' },
            { text: '生活', link: '/posts/life/' },
            { text: 'GitHub', link: 'https://github.com/mujic-ai' }
        ],
        sidebar: {
            '/posts/': getPostsSidebar()
        },
        socialLinks: [
            { icon: 'github', link: 'https://github.com/mujic-ai' }
        ],
        outline: {
            label: '页面导航',
            level: [2, 3]
        }
    }
})
