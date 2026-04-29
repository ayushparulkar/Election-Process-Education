# Democracy Lab — Advanced AI Chatbot + Auth System Implementation

## Approved Plan Steps:

### Phase 1: Dependencies & Config
- [ ] Update package.json (add @supabase/supabase-js, @supabase/ssr, @google/generative-ai)
- [ ] Update next.config.ts (remove static export, add image remotePatterns)
- [ ] npm install

### Phase 2: Supabase Infrastructure
- [ ] Create src/lib/supabase/client.ts (browser client)
- [ ] Create src/lib/supabase/server.ts (server client)
- [ ] Create src/lib/supabase/middleware.ts (session refresh)

### Phase 3: Types & State
- [ ] Create src/types/chat.ts (chat types)
- [ ] Update src/lib/store.ts (add auth state: user, isGuest, loading)

### Phase 4: Authentication System
- [ ] Create src/hooks/use-auth.ts (auth logic hook)
- [ ] Create src/components/auth/auth-provider.tsx (session provider)
- [ ] Create src/components/auth/login-modal.tsx (Google OAuth + Guest Mode)

### Phase 5: Chat Backend
- [ ] Create src/app/api/chat/route.ts (Gemini API streaming endpoint)

### Phase 6: Chat Frontend System
- [ ] Create src/hooks/use-chat.ts (chat logic with streaming, memory, suggestions)
- [ ] Create src/components/chat/chat-message.tsx (message bubble)
- [ ] Create src/components/chat/typing-indicator.tsx (typing animation)
- [ ] Create src/components/chat/suggestion-chips.tsx (clickable suggestions)

### Phase 7: Core UI Updates
- [ ] Update src/app/layout.tsx (wrap with AuthProvider)
- [ ] Update src/app/page.tsx (track active section, pass context to chat)
- [ ] Update src/components/navigation.tsx (add auth buttons, avatar)
- [ ] Rewrite src/components/sections/ai-assistant.tsx (full advanced chatbot)

### Phase 8: Testing & Build
- [ ] npm run dev — test auth flow
- [ ] Test chat streaming, modes, suggestions
- [ ] npm run build — verify production build

