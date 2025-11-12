# shadcn/ui Setup Guide

## Installation Steps

### 1. Create Vite + React Project
```bash
cd c:\EVehical
npm create vite@latest FE -- --template react
cd FE
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Tailwind CSS
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 4. Setup Path Aliases
Edit `vite.config.js` to add path alias support (already configured in this repo).

### 5. Initialize shadcn/ui
```bash
npx shadcn-ui@latest init
```

When prompted, choose:
- **Would you like to use TypeScript?** No
- **Which style would you like to use?** Default
- **Which color would you like to use as base color?** Slate
- **Where is your global CSS file?** src/assets/styles/globals.css
- **Would you like to use CSS variables for colors?** Yes
- **Where is your tailwind.config.js located?** tailwind.config.js
- **Configure the import alias for components:** @/components
- **Configure the import alias for utils:** @/lib/utils

### 6. Add shadcn/ui Components

Add components as needed:

```bash
# Core components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add select
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add label
npx shadcn-ui@latest add form
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add alert-dialog
npx shadcn-ui@latest add skeleton
npx shadcn-ui@latest add popover
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add scroll-area
npx shadcn-ui@latest add table
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add radio-group
npx shadcn-ui@latest add switch
npx shadcn-ui@latest add slider
npx shadcn-ui@latest add progress
```

### 7. Install Additional Dependencies
```bash
npm install @reduxjs/toolkit react-redux react-router-dom
npm install axios socket.io-client
npm install react-hook-form zod @hookform/resolvers
npm install date-fns react-dropzone recharts
npm install sonner # For toast notifications
```

### 8. Project Structure
All files and folders have been created in the structure. Now just:
```bash
npm install
npm run dev
```

## Quick Component Examples

### Button Component Usage
```jsx
import { Button } from "@/components/ui/button"

export default function MyComponent() {
  return (
    <div>
      <Button>Click me</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="destructive">Delete</Button>
    </div>
  )
}
```

### Dialog Component Usage
```jsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function MyDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
```

### Form Component Usage
```jsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export default function LoginForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(values) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

### Toast Notification (using Sonner)
```jsx
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export default function MyComponent() {
  return (
    <Button
      onClick={() => {
        toast.success("Post created successfully!")
      }}
    >
      Create Post
    </Button>
  )
}
```

## Utility Function Usage

```jsx
import { cn } from "@/lib/utils"

// Merge classes conditionally
<div className={cn(
  "base-class",
  isActive && "active-class",
  "another-class"
)} />
```

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Radix UI Documentation](https://www.radix-ui.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [React Hook Form Documentation](https://react-hook-form.com)
- [Zod Documentation](https://zod.dev)
