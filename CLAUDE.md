# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Communication Style

**Be concise. Sacrifice grammar for brevity.** Minimize token/context usage in responses. Use fragments, abbreviations, minimal explanations. Get to the point fast.

## Project Overview

**DelTran** (Delivery Transaction) digitizes daily transaction tracking for small delivery businesses. Structured data entry, automatic profit calculations, and AI-powered analytics.

**Core workflow**: Record daily transactions with:
- Date
- Capital (loan/startup money used)
- Customer payment
- Expenses (description, amount)
- Deductions (loan repayment/savings)
- Auto-calculated profit: `payment - capital - expenses - deductions`

**Supporting features**:
- Vendor management: Reusable supplier contacts
- Item catalog: Products with categories, prices
- Deduction presets: Recurring loan/savings categories

**Design goal**: Simplest possible UX for non-technical users. Management features optional—enable only if patterns repeat.

Follows Clean Architecture: domain, application, infrastructure, presentation layers separated.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Run linter
npm run lint
```

## Architecture

### Clean Architecture Layers

The codebase follows Clean Architecture with dependency inversion:

1. **Domain Layer** (`/domain`)
   - Entity schemas with Zod validation (`/domain/entities`)
   - Repository interfaces (`/domain/repositories`)
   - Common reusable schemas (`/domain/entities/commons`)

2. **Application Layer** (`/application`)
   - Use cases (`/application/use-cases`)
   - Business logic orchestration
   - Use cases depend on repository interfaces, NOT concrete implementations

3. **Infrastructure Layer** (`/infra`)
   - Database adapters (`/infra/adapters/fstore`)
   - Firebase connections (`/infra/db/fstore`)
   - Concrete repository implementations

4. **Presentation Layer** (`/app`, `/components`)
   - Next.js App Router pages
   - React components (UI and custom)
   - API routes

### Dependency Flow

```
app/api → dependency-registry → use-cases → repository interfaces
                                              ↑
                                    infra/adapters (implementations)
```

**Key Pattern**: The `dependency-registry.ts` file at the root wires up concrete implementations to use cases. This is the only place where infrastructure concerns are injected into application logic.

### Entity Schema Pattern

Domain entities use composable Zod schemas:

- `BaseEntitySchema`: Provides `id` field for Firestore documents
- `NameableSchema`: Provides `name` field
- `DescriptableSchema`: Provides `description` field
- `NotableSchema`: Provides `note` field

Entity types are exported in two forms:
- Base type (e.g., `Vendor`): Data without ID, used for creation
- Doc type (e.g., `VendorDoc`): Includes ID field, used for retrieved documents

### Firebase Setup

- **Firebase Admin SDK** is used in API routes (server-side)
- Configuration requires `FIREBASE_SERVICE_ACCOUNT_KEY` environment variable (JSON string)
- Firebase Admin initialized in `infra/db/fstore/fbase-admin.ts`
- Singleton pattern ensures Firebase app is only initialized once

### React Query Integration

React Query is set up in the main layout (`app/(main)/layout.tsx`):
- QueryClient is created per layout instance
- Wraps all pages under the `(main)` route group

### UI Components

- **shadcn/ui** components in `/components/ui`
- Custom components in `/components/custom`
- **SwipeRevealManager**: Singleton pattern for coordinating swipeable card states (ensures only one card is open at a time)

### Route Structure

Routes are defined in `lib/routes.ts` and include:
- `/dashboard`
- `/items`
- `/vendors`
- `/deductions`

All main routes are wrapped in the `(main)` route group which provides the navbar and React Query context.

## Adding New Features

When adding a new entity (e.g., a new domain object):

1. Create entity schema in `/domain/entities/[entity].schema.ts`
2. Create repository interface in `/domain/repositories/[entity].repo.ts`
3. Create use cases in `/application/use-cases/[action]-[entity].case.ts`
4. Implement repository adapter in `/infra/adapters/fstore/[entity].adapter.ts`
5. Wire up dependencies in `dependency-registry.ts`
6. Create API routes in `/app/api/[entity]/route.ts`
7. Add UI pages in `/app/(main)/[entity]/page.tsx`

## Import Aliases

The project uses `@/*` to reference the root directory:
```typescript
import { Vendor } from "@/domain/entities/vendor.schema";
```

## Key Technologies

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript 5**
- **Tailwind CSS 4**
- **Firebase** (Firestore via Admin SDK)
- **Zod** for schema validation
- **TanStack React Query** for server state
- **TanStack React Form** for form management
- **Radix UI** for accessible components
- **shadcn/ui** component library
- **Framer Motion** (`motion` package) for animations
