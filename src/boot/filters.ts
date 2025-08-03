// src/boot/filters.ts
import { boot } from 'quasar/wrappers'
import type { App } from 'vue'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $filters: {
      formatBRL(value: number): string
    }
  }
}

export default boot(({ app }: { app: App }) => {
  app.config.globalProperties.$filters = {
    formatBRL(value: number): string {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value)
    }
  }
})
