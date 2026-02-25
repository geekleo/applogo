// src/app/sign-up/[[...sign-up]]/page.tsx
// 注册页面

import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <SignUp
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'shadow-lg',
          },
        }}
        redirectUrl="/"
        signInUrl="/sign-in"
      />
    </div>
  )
}