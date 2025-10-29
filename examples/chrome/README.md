# Superagent Chrome Extension

A modern Chrome extension built with **Vite**, **React 18**, **TypeScript**, and **shadcn/ui**. Features a beautiful sidebar interface with no external API dependencies.

## Features

- **Vite** for lightning-fast development and builds
- **React 18** for modern UI development
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** components for beautiful, accessible UI
- **Side Panel API** for persistent sidebar interface
- **Hot Module Replacement** during development
- **No inline scripts** - fully compatible with Chrome extension CSP
- **Dark/Light Mode** - automatically follows system preferences
- **Superagent Branding** - ninja logo and official colors

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Development

Preview in browser (recommended for UI development):
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

### 3. Build for Chrome

```bash
npm run build
```

This creates a `dist/` folder with all extension files.

### 4. Load in Chrome

1. Open Chrome → `chrome://extensions/`
2. Enable **Developer mode** (top right toggle)
3. Click **Load unpacked**
4. Select the `dist/` folder
5. Click the Superagent icon in your toolbar!

## Project Structure

```
examples/chrome/
├── src/
│   ├── components/ui/      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── tabs.tsx
│   ├── lib/
│   │   └── utils.ts        # Utility functions
│   ├── App.tsx             # Main sidebar UI
│   ├── main.tsx            # React entry point
│   └── index.css           # Global styles
├── public/
│   ├── manifest.json       # Chrome extension manifest
│   ├── background.js       # Service worker
│   └── icons/              # Extension icons
├── vite.config.ts          # Vite configuration
├── tailwind.config.ts      # Tailwind configuration
└── tsconfig.json           # TypeScript configuration
```

## Development Workflow

### Hot Reload during Development

```bash
npm run dev
```

Changes appear instantly at http://localhost:5173. This is the fastest way to develop your UI.

### Test in Chrome Extension

1. Make changes to your code
2. Run `npm run build`
3. Go to `chrome://extensions/` and click the reload icon

## Adding shadcn/ui Components

Install additional components as needed:

```bash
npx shadcn@latest add [component-name]
```

Examples:
```bash
npx shadcn@latest add input
npx shadcn@latest add textarea
npx shadcn@latest add select
npx shadcn@latest add dialog
```

Browse all components at [ui.shadcn.com](https://ui.shadcn.com)

## Customization

### Update Extension Info

Edit `public/manifest.json`:
```json
{
  "name": "Your Extension Name",
  "description": "Your description",
  "version": "1.0.0"
}
```

### Modify Theme Colors

Edit `src/index.css` CSS variables:
```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96.1%;
  /* ... more variables */
}
```

### Add Custom Components

Create new components in `src/components/`:
```tsx
// src/components/MyComponent.tsx
export function MyComponent() {
  return <div>Hello World</div>
}
```

Import in `src/App.tsx`:
```tsx
import { MyComponent } from '@/components/MyComponent'
```

### Dark/Light Mode

The extension automatically detects and follows your system's dark/light mode preference using the `prefers-color-scheme` media query.

**How it works:**
- Automatically detects system theme on load
- Listens for system theme changes in real-time
- Applies appropriate Tailwind dark mode classes
- Shows theme indicator (Sun/Moon) in header and settings

**Customizing dark mode colors:**

Edit `src/index.css` to customize dark mode variables:
```css
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... more dark mode variables */
}
```

**Testing dark mode:**
1. On macOS: System Settings → Appearance → Dark
2. On Windows: Settings → Personalization → Colors → Dark
3. Chrome DevTools: Rendering → Emulate CSS prefers-color-scheme

The extension will automatically switch themes!

## Chrome Extension APIs

### Background Service Worker

`public/background.js` handles:
- Extension installation
- Toolbar icon clicks (opens sidebar)
- Message passing

Example message from React app:
```typescript
chrome.runtime.sendMessage(
  { action: 'getTabInfo' },
  (response) => {
    console.log(response.data);
  }
);
```

### Side Panel Configuration

Configured in `public/manifest.json`:
```json
{
  "side_panel": {
    "default_path": "index.html"
  }
}
```

## Debugging

**Sidebar**:
- Right-click in sidebar → Inspect

**Background Worker**:
- Go to `chrome://extensions/`
- Find your extension → "Inspect views: service worker"

**Console Logs**:
- Check respective developer tools

## Troubleshooting

### Extension doesn't load
- Ensure you ran `npm run build`
- Load the `dist/` directory, not the root directory
- Check Chrome console for errors

### White screen in extension
- This version fixes the CSP issue that Next.js had
- Vite generates proper external scripts compatible with Chrome extensions

### Styles not applying
- Check that Tailwind is configured correctly
- Ensure `index.css` is imported in `main.tsx`
- Rebuild with `npm run build`

### TypeScript errors
- Run `npm install` to ensure all types are installed
- Check `tsconfig.json` paths configuration

## Why Vite instead of Next.js?

**Vite advantages for Chrome extensions:**
- No inline scripts (Chrome CSP compatible)
- Faster development builds
- Simpler configuration
- Better suited for static builds
- Hot Module Replacement works perfectly

**Next.js challenges:**
- Generates inline scripts that violate Chrome extension CSP
- Designed for server-side rendering (not needed for extensions)
- Requires complex workarounds for extensions

## Tech Stack

- **Vite 5** - Build tool and dev server
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Component library
- **Radix UI** - Accessible primitives
- **Lucide React** - Icon library

## Resources

- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Side Panel API Reference](https://developer.chrome.com/docs/extensions/reference/sidePanel/)
- [Tailwind CSS](https://tailwindcss.com)

## License

MIT

## Next Steps

1. Customize the UI in `src/App.tsx`
2. Add more shadcn/ui components
3. Integrate Chrome extension APIs
4. Add your business logic
5. Build and test in Chrome

Happy coding! 🚀
