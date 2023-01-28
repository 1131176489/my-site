export { }

declare module 'vue' {
    interface ComponentCustomProperties {
      $rem: () => void
    }
  }