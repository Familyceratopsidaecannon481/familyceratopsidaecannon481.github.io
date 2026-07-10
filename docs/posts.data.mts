import fs from 'fs'
import path from 'path'

// 分类配置
const categories: Record<string, string> = {
    tech: '技术分享',
    life: '生活随想'
}

// 递归扫描目录获取所有文章
function scanPostsRecursive(dir: string, baseLink: string, category: string = '') {
    const posts: any[] = []
    const entries = fs.readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        if (entry.isDirectory()) {
            // 子目录作为分类
            posts.push(...scanPostsRecursive(fullPath, `${baseLink}/${entry.name}`, entry.name))
        } else if (entry.name.endsWith('.md')) {
            const content = fs.readFileSync(fullPath, 'utf-8')
            const stats = fs.statSync(fullPath)

            // 提取标题
            const titleMatch = content.match(/^#\s+(.+)$/m)
            const title = titleMatch ? titleMatch[1] : entry.name.replace('.md', '')

            // 提取描述
            const descMatch = content.match(/^(?!#).+$/m)
            const description = descMatch ? descMatch[0].trim() : ''

            // 使用文件修改时间
            const mtime = stats.mtime
            const date = `${mtime.getFullYear()}-${String(mtime.getMonth() + 1).padStart(2, '0')}-${String(mtime.getDate()).padStart(2, '0')} ${String(mtime.getHours()).padStart(2, '0')}:${String(mtime.getMinutes()).padStart(2, '0')}`

            posts.push({
                title,
                description: description.substring(0, 100) + (description.length > 100 ? '...' : ''),
                date,
                timestamp: mtime.getTime(),
                category: categories[category] || category || '未分类',
                link: `${baseLink}/${entry.name.replace('.md', '')}`
            })
        }
    }
    return posts
}

export default {
    watch: ['./posts/**/*.md'],
    load() {
        const postsDir = path.resolve(__dirname, 'posts')
        return scanPostsRecursive(postsDir, '/posts')
            .sort((a, b) => b.timestamp - a.timestamp)
    }
}
