import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    isRealNavigation?: boolean
  }
}

export {}
