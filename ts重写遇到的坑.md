## 记录用ts重写所遇到的坑


### 配置ts环境

1. 新增ts-loader，增加tsconfig.json
2. 为了让ts认识.vue文件，在src目录下新增`vue-shim.d.ts`
```javascript
declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}
```

### 改写main.js为ts
