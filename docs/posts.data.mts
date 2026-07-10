import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

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
    // 跳过 frontmatter 后找第一个一级标题
    const body = content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '')
    const match = body.match(/^#\s+(.+)$/m)
    return match ? match[1].trim() : null
}

function dirDisplayName(dirPath: string, dirName: string): string {
    return (
        readTitle(path.join(dirPath, 'index.md')) ||
        fallbackNames[dirName] ||
        dirName
    )
}

function formatDate(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** 解析 YAML frontmatter 中的 date: YYYY-MM-DD */
function parseFrontmatterDate(content: string): Date | null {
    const fm = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
    if (!fm) return null
    const m = fm[1].match(/^date:\s*['"]?(\d{4}-\d{2}-\d{2})['"]?\s*$/m)
    if (!m) return null
    const d = new Date(`${m[1]}T12:00:00`)
    return Number.isNaN(d.getTime()) ? null : d
}

/** 用 git 首次提交时间兜底（shallow clone 时可能失败） */
function gitFirstCommitDate(filePath: string): Date | null {
    try {
        const out = execSync(
            `git log --diff-filter=A --follow --format=%aI -1 -- ${JSON.stringify(filePath)}`,
            { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] }
        ).trim()
        if (!out) return null
        const d = new Date(out)
        return Number.isNaN(d.getTime()) ? null : d
    } catch {
        return null
    }
}

/** 取一段可读摘要，跳过 frontmatter / 标题 / tip / 引用 */
function extractDescription(content: string): string {
    const body = content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '')
    const lines = body.split(/\r?\n/)
    for (const line of lines) {
        const t = line.trim()
        if (!t) continue
        if (t.startsWith('#')) continue
        if (t.startsWith(':::')) continue
        if (t.startsWith('```')) continue
        if (t.startsWith('>')) continue
        if (t.startsWith('![')) continue
        if (t.startsWith('<')) continue
        // 去掉简单 markdown 标记
        const plain = t
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            .replace(/[*_`~]/g, '')
            .trim()
        if (plain.length < 4) continue
        return plain.length > 100 ? plain.slice(0, 100) + '...' : plain
    }
    return ''
}

function resolveDate(fullPath: string, content: string): Date {
    const fromFm = parseFrontmatterDate(content)
    if (fromFm) return fromFm

    const fromGit = gitFirstCommitDate(fullPath)
    if (fromGit) return fromGit

    return fs.statSync(fullPath).mtime
}

function makePost(
    fullPath: string,
    link: string,
    category: string,
    series: string | null,
    isIndex: boolean
): Post {
    const content = fs.readFileSync(fullPath, 'utf-8')
    const title =
        readTitle(fullPath) || path.basename(fullPath).replace(/\.md$/, '')
    const dateObj = resolveDate(fullPath, content)

    return {
        title,
        description: extractDescription(content),
        date: formatDate(dateObj),
        timestamp: dateObj.getTime(),
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
 * - 各目录 index.md 也会作为可访问文章收录（首页会过滤）
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
