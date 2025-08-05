import { type RouteConfig, index, layout, route } from '@react-router/dev/routes'

export default [
  layout('layouts/simple-layout.tsx', [
    index('routes/home.tsx'),
    route('about', 'routes/about.tsx'),
    route('table-advanced', 'routes/table-advanced.tsx'),
    route('file-manager', 'routes/file-manager.tsx'),
  ]),
] satisfies RouteConfig
