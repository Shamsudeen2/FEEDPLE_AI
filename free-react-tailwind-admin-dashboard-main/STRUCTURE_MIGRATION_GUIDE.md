# Feature-Based Project Structure Migration Guide

## Overview

This project has been restructured from a **type-based** architecture to a **feature-based** architecture. This improves scalability, maintainability, and makes it easier to locate related code.

## New Folder Structure

```
src/
├── features/              # Feature-specific modules
│   ├── auth/             # Authentication feature
│   │   ├── components/   # Auth-specific components (SignInForm, SignUpForm)
│   │   ├── pages/        # Auth pages (SignIn, SignUp)
│   │   └── index.ts      # Feature exports
│   ├── dashboard/        # Dashboard feature
│   │   ├── components/   # Dashboard components
│   │   ├── pages/        # Dashboard pages
│   │   └── index.ts
│   ├── forms/            # Forms feature
│   │   ├── components/   # Form components
│   │   ├── form-elements/# Form element variations
│   │   ├── pages/        # Form pages
│   │   └── index.ts
│   ├── charts/           # Charts feature
│   │   ├── components/   # Chart components (BarChart, LineChart)
│   │   ├── pages/        # Chart pages
│   │   └── index.ts
│   ├── tables/           # Tables feature
│   │   ├── components/   # Table components
│   │   ├── pages/        # Table pages
│   │   └── index.ts
│   ├── calendar/         # Calendar feature
│   │   ├── components/   # Calendar components
│   │   ├── pages/        # Calendar pages
│   │   └── index.ts
│   ├── ecommerce/        # E-commerce feature
│   │   ├── components/   # E-commerce components
│   │   └── index.ts
│   ├── user-profile/     # User profile feature
│   │   ├── components/   # Profile components
│   │   └── index.ts
│   └── ui-elements/      # UI elements showcase
│       ├── components/   # UI element components
│       ├── pages/        # UI element pages
│       └── index.ts
├── shared/               # Shared across features
│   ├── components/       # Shared components
│   │   ├── common/       # Generic shared components
│   │   ├── form/         # Form-related components
│   │   ├── ui/           # UI components (Button, Modal, etc.)
│   │   ├── header/       # Header component  
│   │   ├── layout/       # Layout wrappers
│   │   └── index.ts
│   ├── hooks/            # Shared custom hooks
│   │   ├── useGoBack.ts
│   │   ├── useModal.ts
│   │   └── index.ts
│   └── utils/            # Shared utilities
├── core/                 # Application core
│   ├── context/          # React contexts (Theme, Sidebar)
│   └── constants/        # App constants
├── icons/                # Icon exports (shared across app)
├── layout/               # Main layout components
│   ├── AppLayout.tsx
│   ├── AppHeader.tsx
│   ├── AppSidebar.tsx
│   └── Backdrop.tsx
├── App.tsx              # Root component
└── main.tsx             # Entry point
```

## Benefits of Feature-Based Structure

✅ **Better Organization**: Related code is grouped together
✅ **Easier Scaling**: Adding new features doesn't bloat the folder structure
✅ **Improved Maintainability**: Features can be understood and modified in isolation
✅ **Clearer Dependencies**: Feature dependencies are obvious from imports
✅ **Team Collaboration**: Multiple developers can work on different features with less conflicts

## Migration Steps

### Phase 1: Completed ✓
- [x] Created feature folder structure
- [x] Created shared folder for reusable components
- [x] Created core folder for application-wide resources
- [x] Migrated auth feature (example)

### Phase 2: Move Feature Components

For each feature below, follow this pattern:

#### Step 2.1: Dashboard Feature
Move from: `src/pages/Dashboard/Home.tsx` → `src/features/dashboard/pages/Home.tsx`
Move from: `src/components/ecommerce/*` → `src/features/ecommerce/components/`

**Files to move:**
- `src/pages/Dashboard/Home.tsx` → `src/features/dashboard/pages/Home.tsx`

#### Step 2.2: Forms Feature
Move from: `src/pages/Forms/FormElements.tsx` → `src/features/forms/pages/FormElements.tsx`
Move from: `src/components/form/*` → `src/features/forms/components/`

**Files to move:**
- `src/components/form/Form.tsx` → `src/features/forms/components/Form.tsx`
- `src/components/form/Label.tsx` → `src/features/forms/components/Label.tsx`
- `src/components/form/MultiSelect.tsx` → `src/features/forms/components/MultiSelect.tsx`
- `src/components/form/Select.tsx` → `src/features/forms/components/Select.tsx`
- `src/components/form/form-elements/*` → `src/features/forms/form-elements/`
- `src/components/form/group-input/*` → `src/features/forms/components/`
- `src/components/form/input/*` → `src/features/forms/components/input/`
- `src/components/form/switch/*` → `src/features/forms/components/switch/`

#### Step 2.3: Charts Feature
**Files to move:**
- `src/pages/Charts/BarChart.tsx` → `src/features/charts/pages/BarChart.tsx`
- `src/pages/Charts/LineChart.tsx` → `src/features/charts/pages/LineChart.tsx`
- `src/components/charts/bar/*` → `src/features/charts/components/bar/`
- `src/components/charts/line/*` → `src/features/charts/components/line/`

#### Step 2.4: Tables Feature
**Files to move:**
- `src/pages/Tables/BasicTables.tsx` → `src/features/tables/pages/BasicTables.tsx`
- `src/components/tables/*` → `src/features/tables/components/`

#### Step 2.5: Calendar Feature
**Files to move:**
- `src/pages/Calendar.tsx` → `src/features/calendar/pages/Calendar.tsx`

#### Step 2.6: E-commerce Feature
**Files to move:**
- `src/components/ecommerce/*` → `src/features/ecommerce/components/`

#### Step 2.7: User Profile Feature
**Files to move:**
- `src/pages/UserProfiles.tsx` → `src/features/user-profile/pages/UserProfiles.tsx`
- `src/components/UserProfile/*` → `src/features/user-profile/components/`

#### Step 2.8: UI Elements Feature
**Files to move:**
- `src/pages/UiElements/*` → `src/features/ui-elements/pages/`
- `src/components/ui/*` → `src/features/ui-elements/components/`

### Phase 3: Move Shared Components

Move from `src/components/*` to `src/shared/components/*`:
- `src/components/common/*` → `src/shared/components/common/`
- `src/components/header/*` → `src/shared/components/header/`

Also move layout components:
- `src/layout/*` → `src/layout/` (already in place, keep here as it's app-wide)

### Phase 4: Move Core Resources

Move from `src/` to `src/core/`:
- `src/context/SidebarContext.tsx` → `src/core/context/SidebarContext.tsx`
- `src/context/ThemeContext.tsx` → `src/core/context/ThemeContext.tsx`

### Phase 5: Update All Imports

After moving files, update imports across the project:

**Before:**
```typescript
import SignInForm from "../../components/auth/SignInForm";
import Label from "../../components/form/Label";
import { useGoBack } from "../../hooks/useGoBack";
import { SidebarContext } from "../../context/SidebarContext";
```

**After:**
```typescript
import { SignInForm } from "@/features/auth";
import Label from "@/shared/components/form/Label";
import { useGoBack } from "@/shared/hooks";
import { SidebarContext } from "@/core/context";
```

### Phase 6: Create Index Files

Create `index.ts` in each feature folder for clean exports:

**Example: `src/features/dashboard/index.ts`**
```typescript
export { default as Home } from "./pages/Home";
export * from "./components";
```

## Import Paths - Quick Reference

### Using Absolute Imports (Recommended)

Update `tsconfig.json` (if not already set up):
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/features/*": ["src/features/*"],
      "@/shared/*": ["src/shared/*"],
      "@/core/*": ["src/core/*"],
      "@/layout/*": ["src/layout/*"],
      "@/icons/*": ["src/icons/*"]
    }
  }
}
```

Then use imports like:
```typescript
import { SignIn, SignUp } from "@/features/auth";
import Button from "@/shared/components/ui/button/Button";
import { ThemeContext } from "@/core/context";
```

### Using Relative Imports (Current - Still Valid)

After migration, relative imports from features still work:
```typescript
import Component from "../../../shared/components/Button";
```

## File-by-File Migration Example

### Example: Moving a Form Component

#### Step 1: Copy the file
```bash
cp src/components/form/Label.tsx src/features/forms/components/Label.tsx
```

#### Step 2: Update imports in the new file
Change imports from relative to point to new paths:
```typescript
// Before
import Input from "../input/InputField";
import { useTheme } from "../../context/ThemeContext";

// After  
import Input from "./input/InputField";
import { useTheme } from "../../../core/context";
```

#### Step 3: Update all files that imported from the old location
Find and replace in your project:
```
"../../components/form/Label"
→
"@/features/forms/components/Label"
```

#### Step 4: Delete original file (after verifying no imports remain)
```bash
rm src/components/form/Label.tsx
```

## Next Steps

1. **Start with one feature** (e.g., auth is already done)
2. **Move all files** for that feature to `src/features/{feature-name}`
3. **Update imports** in those files
4. **Update all imports** that reference those files from elsewhere
5. **Create index.ts** for the feature for clean exports
6. **Test thoroughly** before moving to next feature
7. **Repeat** for each feature

## Automated Migration Script

You can create a Node.js script to help with bulk file copying and import updating. Example:

```javascript
// migrate-feature.js
const fs = require('fs');
const path = require('path');

function migrateFeature(featureName, sourceDir, targetDir) {
  // Copy files
  // Update relative imports to absolute imports
  // Generate index.ts
}

// Usage: node migrate-feature.js forms src/components/form src/features/forms
```

## Common Issues & Solutions

### Issue: "Cannot find module" errors after migration
**Solution**: Check that all import paths have been updated to point to new locations

### Issue: Circular dependencies
**Solution**: Ensure shared components don't import from features. Only features should import from shared

### Issue: Breaking routes
**Solution**: Update route definitions in your routing config to import from new feature locations

## Testing Your Migration

After each feature migration:
1. **Build**: `npm run build`
2. **Check for errors**: `npm run lint`
3. **Test in browser**: Verify that feature works correctly
4. **PR review**: Have team review changes

## Questions?

If you need help with a specific feature migration, refer to the auth feature (already completed) as an example pattern to follow.
