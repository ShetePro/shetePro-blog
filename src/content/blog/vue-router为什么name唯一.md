---
title: Vue Router 中name为什么要唯一
description: 'vue-router 源码探索'
pubDate: '2025-03-17'
heroImage: '/heroImage/vue-computed-properties.png'
categories: ['vue']
authors: ['shetePro']
tags: ['vue-router', 'vue']
---
# Vue Router 中 `name` 为什么要唯一？

## Vue Router 内部机制解析

在使用 Vue Router 动态添加路由时，你可能会发现**如果两个路由的 `name` 相同，后添加的路由会替换掉先前的路由**。这是为什么呢？带着这个疑问，我们深入 Vue Router 源码进行探索。

## 现象：相同 `name` 的路由会被替换

假设我们有以下两个动态路由，它们的 `name` 不同，但 `menuName` 相同：
在 Vue Router 内部，`name` 不是可选项，而是用来维护路由匹配的**唯一标识符**。Vue Router 使用 `matcherMap`（基于 `Map`）来存储和管理已注册的路由。当新路由的 `name` 和已有路由相同时，Vue Router 会**自动移除旧的路由**。
```json
[{
  "id": "14",
  "menuName": "表格",
  "menuPath": "/component/table/TableView",
  "icon": "ci:table",
  "type": 0,
  "keepAlive": false,
  "transition": "",
  "children": []
},
{
  "id": "15",
  "menuName": "表格",
  "menuPath": "/component/dialog/DialogView",
  "icon": "entypo:popup",
  "type": 0,
  "keepAlive": false,
  "transition": "",
  "children": []
}]
```
### `name` 作为唯一标识
在 `router.addRoute()` 逻辑中，我们可以看到 Vue Router **先删除旧的相同 `name` 路由，再插入新的**：

```ts
// 移除已存在的相同 `name` 路由（仅针对根级路由）
if (isRootAdd && record.name && isAliasRecord(matcher)) {
  if (__DEV__) {
    checkSameNameAsAncestor(record, parent);
  }
  removeRoute(record.name);
}
```

### `matcherMap` 维护唯一的 `name`

Vue Router 在 `insertMatcher` 方法中，会检查 `name` 是否已存在，并存入 `matcherMap`：

```ts
function insertMatcher(matcher: RouteRecordMatcher) {
  const index = findInsertionIndex(matcher, matchers);
  matchers.splice(index, 0, matcher);

  // 只有原始记录才会添加到 `name` 映射表
  if (matcher.record.name && !isAliasRecord(matcher)) {
    matcherMap.set(matcher.record.name, matcher);
  }
}
```

### 结论：`name` 必须唯一，否则会引发问题

1. **Vue Router 依赖 `name` 进行路由匹配**，如果 `name` 重复，会导致后添加的路由覆盖前一个路由。

2. **在动态添加路由时，应先检查 `name` 是否已存在**，避免意外覆盖：

   ```ts
   const routeExists = router.getRecordMatcher("Home")
   if (!routeExists) {
     router.addRoute({ path: "/dashboard", name: "Home", component: Dashboard });
   }
   ```

3. **如果确实需要相同 `menuName`，可以使用不同的 `name`**，如：

   ```ts
   router.addRoute({ path: "/table", name: "TableView", component: TableView });
   router.addRoute({ path: "/dialog", name: "DialogView", component: DialogView });
   ```

## 总结

在 Vue Router 配置路由时，务必确保 `name` 的值是**唯一**的。\
如果路由加载失败，首先检查是否是 `name` 重复导致的问题。
