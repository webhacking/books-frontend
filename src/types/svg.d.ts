declare module 'svgs/*.svg' {
  const content: React.ComponentType<React.SVGProps<SVGElement>>;
  export default content;
}

declare module 'assets/svg/*.svg' {
  const content: string;
  export default content;
}
