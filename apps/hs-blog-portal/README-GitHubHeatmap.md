# 🔥 GitHub Heatmap Component

A stunning, interactive React component that displays GitHub contribution activity in a beautiful heatmap format, enhanced with modern animations and glassmorphism design.

## ✨ Features

- 📊 **Interactive Visualization** - Beautiful GitHub contribution heatmap
- 🎨 **Modern Design** - Glassmorphism effects with shadcn/ui components
- 🌈 **Smooth Animations** - Framer Motion powered transitions
- 🌙 **Dark Mode Support** - Seamless theme switching
- 🔄 **Loading States** - Elegant skeleton animations
- 📱 **Responsive Design** - Mobile-first approach
- 🎯 **Rich Tooltips** - Detailed contribution information on hover
- 📅 **Year Selection** - Browse contributions across different years
- ⚡ **Performance Optimized** - Efficient rendering with React best practices

## 🚀 Tech Stack

- **React 19** - Latest React features
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful, accessible components
- **Framer Motion** - Smooth animations
- **Radix UI** - Headless UI primitives

## 📦 Installation

The component uses the following dependencies:

```bash
pnpm install framer-motion @radix-ui/react-tooltip @radix-ui/react-slot class-variance-authority clsx tailwind-merge
```

## 🎯 Usage

### Basic Usage

```tsx
import GitHubHeatmap from '@/components/GitHubHeatmap';

function MyComponent() {
  return (
    <GitHubHeatmap 
      username="huoshan25" 
      year={2025}
    />
  );
}
```

### Advanced Usage with Custom Styling

```tsx
import GitHubHeatmap from '@/components/GitHubHeatmap';

function MyComponent() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <GitHubHeatmap 
        username="huoshan25" 
        year={2025}
        className="shadow-2xl border-2 border-emerald-200 dark:border-emerald-800"
      />
    </div>
  );
}
```

## 🎨 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `username` | `string` | - | GitHub username (required) |
| `year` | `number` | Current year | Year to display contributions for |
| `className` | `string` | `''` | Additional CSS classes |

## 🌐 API

The component fetches data from the GitHub Contributions API:

- **Endpoint**: `https://github-contributions-api.jogruber.de/v4/{username}?y={year}`
- **Response Format**:
  ```json
  {
    "total": {
      "2025": 958
    },
    "contributions": [
      {
        "date": "2025-01-01",
        "count": 0,
        "level": 0
      }
    ]
  }
  ```

## 🎨 Contribution Levels

The heatmap uses 5 levels (0-4) with beautiful gradient colors:

- **Level 0**: No contributions (subtle gray with transparency)
- **Level 1**: Low activity (light emerald with soft glow)
- **Level 2**: Moderate activity (medium emerald with enhanced glow)
- **Level 3**: High activity (bright emerald with strong glow)
- **Level 4**: Very high activity (intense emerald with maximum glow)

## 🎭 Animations

- **Staggered Entry** - Cells animate in with a wave effect
- **Hover Effects** - Smooth scale and glow transitions
- **Loading States** - Elegant skeleton animations
- **Tooltip Animations** - Smooth fade and scale effects

## 🎨 Styling

The component uses:
- **Glassmorphism** - Backdrop blur effects
- **Gradient Backgrounds** - Beautiful color transitions
- **Shadow Effects** - Depth and elevation
- **Border Animations** - Interactive hover states

## 🔧 Customization

You can customize the appearance by:
1. Modifying CSS variables in your global styles
2. Extending Tailwind configuration
3. Overriding component classes via the `className` prop

## 🚀 Performance

- **Optimized Rendering** - Efficient grid layout
- **Lazy Animations** - Staggered loading for smooth performance
- **Memory Efficient** - Proper cleanup and state management
- **Responsive** - Adapts to different screen sizes

## 🎯 Demo

Visit `/github-heatmap` in your application to see the interactive demo with:
- Real-time username input
- Year selection
- Live preview updates
- Responsive design showcase
