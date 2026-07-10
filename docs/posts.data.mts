import fs from 'fs'
import path from 'path'

// 无 index.md 时的兜底（优先读目录 index.md 的 # 标题）
const fallbackNames: Record<string, string> = {
    tech: '技术分享',
    life: '生活随想'
}

const IGNORE_DIRS = new Set(['images', 'assets', 'public', 'components'])

type Post = {
    title: string
    description: string
    date: string
    timestamp: number
    category: string
    series: string | null
    link: string
    /** 是否为目录介绍页（index.md） */
    isIndex: boolean
}

function readTitle(filePath: string): string | null {
    if (!fs.existsSync(filePath)) return null
    const content = fs.readFileSync(filePath, 'utf-8')
    const match = content.match(/^#\s+(.+)$/m)
    return match ? match[1].trim() : null
}

function dirDisplayName(dirPath: string, dirName: string): string {
    return (
        readTitle(path.join(dirPath, 'index.md')) ||
        fallbackNames[dirName] ||
        dirName
    )
}

function formatDate(mtime: Date): string {
    return `${mtime.getFullYear()}-${String(mtime.getMonth() + 1).padStart(2, '0')}-${String(mtime.getDate()).padStart(2, '0')} ${String(mtime.getHours()).padStart(2, '0')}:${String(mtime.getMinutes()).padStart(2, '0')}`
}

function makePost(
    fullPath: string,
    link: string,
    category: string,
    series: string | null,
    isIndex: boolean
): Post {
    const content = fs.readFileSync(fullPath, 'utf-8')
    const stats = fs.statSync(fullPath)
    const title =
        readTitle(fullPath) || path.basename(fullPath).replace(/\.md$/, '')

    const descMatch = content.match(/^(?!#).+$/m)
    const description = descMatch ? descMatch[0].trim() : ''

    return {
        title,
        description:
            description.substring(0, 100) +
            (description.length > 100 ? '...' : ''),
        date: formatDate(stats.mtime),
        timestamp: stats.mtime.getTime(),
        category,
        series,
        link,
        isIndex
    }
}

/**
 * 递归扫描：
 * - posts 下第一层目录 = 一级分类（可用 index.md 命名）
 * - 更深子目录 = 系列（index.md 的 # 标题即系列名）
 * - 各目录 index.md 也会作为可访问文章收录
 */
function scanPostsRecursive(
    dir: string,
    baseLink: string,
    topCategoryKey: string = '',
    topCategoryLabel: string = '',
    seriesLabel: string | null = null
): Post[] {
    const posts: Post[] = []
    if (!fs.existsSync(dir)) return posts

    const entries = fs.readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
        if (entry.name.startsWith('.')) continue
        const fullPath = path.join(dir, entry.name)

        if (entry.isDirectory()) {
            if (IGNORE_DIRS.has(entry.name)) continue

            const childLink = `${baseLink}/${entry.name}`
            const label = dirDisplayName(fullPath, entry.name)

            if (!topCategoryKey) {
                // 第一层：分类
                posts.push(
                    ...scanPostsRecursive(
                        fullPath,
                        childLink,
                        entry.name,
                        label,
                        null
                    )
                )
            } else {
                // 更深：系列（系列名来自该目录 index.md）
                posts.push(
                    ...scanPostsRecursive(
                        fullPath,
                        childLink,
                        topCategoryKey,
                        topCategoryLabel,
                        label
                    )
                )
            }
        } else if (entry.name.endsWith('.md')) {
            const isIndex = entry.name === 'index.md'
            const link = isIndex
                ? `${baseLink}/`
                : `${baseLink}/${entry.name.replace(/\.md$/, '')}`

            // 系列介绍页本身不再挂 series 标签，避免重复
            const seriesForPost = isIndex ? null : seriesLabel

            posts.push(
                makePost(
                    fullPath,
                    link,
                    topCategoryLabel || '未分类',
                    seriesForPost,
                    isIndex
                )
            )
        }
    }

    return posts
}

export default {
    watch: ['./posts/**/*.md'],
    load() {
        const postsDir = path.resolve(__dirname, 'posts')
        return scanPostsRecursive(postsDir, '/posts').sort(
            (a, b) => b.timestamp - a.timestamp
        )
    }
}
