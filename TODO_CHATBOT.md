# Chatbot Rebuild TODO

## Files Modified

- [x] `src/app/api/chat/route.ts` — Full rewrite (non-streaming, proper errors, model fix)
- [x] `src/types/chat.ts` — Added `isError` field to ChatMessage
- [x] `src/hooks/use-chat.ts` — Refactored (MAX_HISTORY 5, typing effect, error handling)
- [x] `src/components/chat/chat-message.tsx` — Uses `isError`, added typing cursor
- [x] `src/components/sections/ai-assistant.tsx` — Passes `isTyping` to ChatMessage

## Verification

- [x] TypeScript check passes (`npx tsc --noEmit`)
- [x] No `userMessage` API references remaining
- [x] Model updated to `gemini-1.5-flash-latest`
- [x] MAX_HISTORY = 5
- [x] API returns `{ reply: string }` or `{ error: string }`
- [x] Frontend handles JSON response (non-streaming)
- [x] Typing effect implemented
- [x] Error messages use `isError` flag

