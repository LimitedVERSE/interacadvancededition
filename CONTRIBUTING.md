# Contributing to Interac Money Transfer Interface

Thank you for your interest in contributing to the Interac Money Transfer Interface demo.

## Development Setup

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd interac-transfer-ui
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open the app**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Architecture

### Directory Structure

- `/app` - Next.js App Router pages and layouts
- `/components` - React components (all client components)
- `/services` - Business logic and data fetching layer
- `/types` - TypeScript type definitions
- `/config` - Application configuration
- `/public` - Static assets (bank logos, icons)

### Key Principles

1. **Service Layer Pattern**: All data fetching goes through `/services`
2. **Type Safety**: Full TypeScript with no `any` types
3. **Accessibility First**: WCAG 2.1 AA compliance
4. **Mobile-First**: Responsive design starting from smallest screens
5. **Error Handling**: Graceful degradation with loading and error states

## Adding New Features

### Adding a New Bank

1. Add bank data to `services/mockData.ts`:
   \`\`\`ts
   { id: "newbank", name: "New Bank", logo: "/newbank-logo.jpg" }
   \`\`\`

2. Add bank logo image to `/public` directory

3. The bank will automatically appear in the grid

### Adding a New Service Function

1. Create or update service file in `/services`
2. Add proper TypeScript types
3. Include simulated delay using `appConfig.api.simulatedDelay`
4. Add JSDoc comments
5. Export function for use in components

### Modifying UI Components

1. Always maintain ARIA labels and semantic HTML
2. Test keyboard navigation (Tab, Enter, Space)
3. Ensure mobile responsiveness
4. Follow Interac color scheme (yellow #FDB913, black, white)
5. Add loading and error states for async operations

## Code Style

- **TypeScript**: Use strict mode, define all types
- **React**: Functional components with hooks
- **CSS**: Tailwind utility classes, mobile-first
- **Formatting**: Prettier with default settings
- **Linting**: ESLint with Next.js config

## Testing Checklist

Before submitting changes, verify:

- [ ] TypeScript compiles without errors
- [ ] Component renders on mobile (320px width)
- [ ] Keyboard navigation works
- [ ] Screen reader announces state changes
- [ ] Loading states display properly
- [ ] Error states handle gracefully
- [ ] Focus indicators are visible
- [ ] Bank logos load correctly

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes following the guidelines above
3. Test thoroughly across devices and browsers
4. Update documentation if needed
5. Submit PR with clear description of changes

## Questions?

For questions about the Interac Developer Network or this demo interface, please contact the development team.

## License

This is a demo application for internal use within the Interac Developer Network.
