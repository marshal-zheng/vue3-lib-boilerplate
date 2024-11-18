import { VNode, Ref, CSSProperties } from 'vue'
declare module 'vue-demo' {
  import { DefineComponent } from 'vue';

  interface DemoProps {
    text?: string;
  }

  const Demo: DefineComponent<Partial<DemoProps>>;
  export { Demo }
  export type { DemoProps }
}
