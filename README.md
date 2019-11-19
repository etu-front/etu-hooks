# Etu Hooks Lib

> 常用 hooks 库

## Usage
- useTitle
- useDataLoader
- useWindowSize

1. useTtitle
```tsx
import { useTitle } from '@etu/hooks'

// Component
  // 第一种用法
  useTitle('页面标题', true)

  // 第二种用法 jsx 中
  const { DocumentTitle } = useTitle
  <DocumentTitle title="页面标题2" useReset />
```

2. useDataLoader
```tsx
import request from '@/utils/request'
import { useDataLoader } from '@etu/hooks'

interface IUser {
  id: number
  name: string
}
interface UserListReturn {
  results: IUser[]
  pageInfo: { page: number, pageSize: number, count: number }
}
// Component
const { data, loading, error, update } = useDataLoader(getUserList, 1, 20)
  if (error) return <div>出错啦</div>
  if (loading) return <div>loading...</div>

  return (
    <div>
      <ul>
        {data.results.map(u => <li key={u.id}>{u.name}</li>)}
      </ul>
      <button type="button" onClick={() => update({ results: [] })}>清空</button>
    </div>
  )
```

## 开发
```bash
$ git clone git@github.com:etu-front/etu-hooks.git
$ cd etu-hooks
$ npm install
$ npm run dev
# visit http://localhost:3000
```
## 发布
```bash
$ npm run pub
```
## Git 提交 emoji

- 🐛 🚑 修复bug
- ✨ 新功能
- 🔥 删除代码或文件
- 💩 需要提升的 shit 代码
- 🎁 新增组件
- ️️♻️ 🔨 重构
- 🚀 部署或提升性能
- 💄 🎨 UI 样式 css style
- 📝 文档或注释
- 🌐 i18n
- ✏️ 修复 typo 错误
- ➕ 增加依赖包
- 📦 更新打包
- 🎉 初始化
