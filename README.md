# Swipinion

**Swipinion** is a social app for opinions you swipe through. Users post short opinions (text, an image, or both, with hashtags), and everyone else reacts by swiping cards: **agree**, **disagree** or **skip**, with an optional comment. Around that sit profiles, followers, favorites, direct messages, notifications and fine-grained privacy settings.

> ⚠️ **Status:** work in progress.

---

## Features

### Opinions feed
- Opinion cards are shown one at a time in a carousel and loaded in batches of 20, with the next batch fetched before you run out.
- **Swipe gestures** on touch devices: swipe a card left or right to react, with drag animations that follow your finger. Buttons do the same on desktop: 👍 agree, ✕ skip, 👎 disagree.
- You can attach a comment to a reaction.
- Every opinion has its own shareable page at `/opinion/:id`.
- Opinion types: **text**, **image**, or **text + image**, with **hashtags**.
- Each opinion shows agree and disagree statistics.

### Users and social
- Public profiles at `/user/:username` with tabs for **Opinions**, **Reactions** and **Favorites**, plus a thumbnail and bio.
- **Follow** and **unfollow** other users. Accounts can require follow approval, with accept and decline for requests.
- **Favorites:** save opinions to come back to later.
- **User search** by username.

### Messaging and notifications
- **Direct messages** between users, with conversation threads and read status.
- **Saved messages:** a personal notes-to-self thread.
- **Notifications** for new followers and follow requests.
- New messages and notifications are picked up by polling every 10 seconds.

### Privacy settings
Each user decides who can message them, follow them, and see their followers, following, opinions, reactions and favorites. The choices are **Everyone**, **Followers only** or **No one**. Follows can also be set to **Everyone** or **By approval**.

### Accounts
- Sign up with email confirmation by code, sign in, password recovery and reset, and password change.
- JWT access tokens (short-lived) and refresh tokens (long-lived). Each user has a per-user `access_key`, so their tokens can be revoked.
- Images are uploaded through [imgbb](https://imgbb.com/).

## Tech stack

| Layer | Technologies |
|---|---|
| **Client** (`src/client`) | Angular 16, Angular Material, Apollo Angular (GraphQL), NGXS (state), RxJS, SCSS |
| **Server** (`src/server`) | Node.js, TypeScript 5, Fastify, Apollo Server 3 (GraphQL), PostgreSQL (`pg`), Joi, bcrypt, jsonwebtoken, Nodemailer |
| **Tooling** | ESLint, Prettier, Stylelint, Karma + Jasmine, Postman collection and environment |

## Project structure

```
swipinion/
├── postman/
│   ├── Swipinion.postman_collection.json
│   └── Swipinion.postman_environment.json
└── src/
    ├── client/                            # Angular app
    │   ├── proxy.conf.json                # Proxies /graphql → http://localhost:4000
    │   └── src/app/
    │       ├── modules/
    │       │   ├── opinions/              # Feed: carousel, card, comment dialog
    │       │   ├── user/                  # Profile page and its tabs
    │       │   ├── user-messages/         # Direct & saved messages
    │       │   ├── user-notifications/
    │       │   ├── user-settings/         # Privacy & account settings
    │       │   └── page-not-found/
    │       ├── shared/
    │       │   ├── components/            # Dialogs, inputs, messaging UI, opinion preview, ...
    │       │   └── directives/swipe/      # Touch swipe gesture handling
    │       ├── graphql/                   # Queries & mutations per domain
    │       ├── services/                  # Domain services (auth, opinion, reaction, follower, ...)
    │       ├── guards/ resolvers/ interceptors/
    │       └── typings/ constants/ utilities/
    └── server/                            # GraphQL API
        └── src/
            ├── index.ts                   # Fastify + Apollo bootstrap
            ├── environments/              # development / production config
            ├── graphql/schemas/           # One folder per domain
            ├── data/
            │   ├── tables/                # CREATE TABLE definitions
            │   └── queries/               # SQL query builders
            ├── validators/                # Joi schemas
            ├── scripts/create-tables.ts   # DB bootstrap script
            └── constants/ typings/ utilities/
```

### Database tables

`users`, `user_settings`, `user_opinions`, `tags`, `user_opinion_reactions`, `user_favorite_opinions`, `user_followers`, `user_messages`, `user_saved_messages`, `user_notifications`

## Getting started

### Prerequisites

- **Node.js** 18+ and npm
- **PostgreSQL**
- An SMTP account for confirmation and recovery emails. The dev config uses [Ethereal](https://ethereal.email/), a fake SMTP service that's handy for testing.

### 1. Server

```bash
cd src/server
npm install
```

Set your values in `src/server/src/environments/development.ts`:

| Key | Description |
|---|---|
| `APP_ORIGIN` | Client URL (default `http://localhost:4200`) |
| `PORT` | API port (default `4000`) |
| `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`, `DB_HOSTNAME`, `DB_PORT` | PostgreSQL connection |
| `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD` | SMTP transport |
| `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, `RECOVERY_SECRET` | JWT signing secrets |
| `ACCESS_TOKEN_EXPIRES_IN`, `REFRESH_TOKEN_EXPIRES_IN`, `RECOVERY_KEY_EXPIRES_IN` | Token lifetimes |

Create the database and its tables, then start the API:

```bash
createdb swipinion
npm run create-tables
npm run dev
# 🚀 Server ready at http://localhost:4000/graphql
```

The development config loads when the server runs under `ts-node-dev`. Otherwise the server loads `production.ts`.

### 2. Client

Put your imgbb API key in `src/client/src/app/constants/imgbb.ts`, then:

```bash
cd src/client
npm install
npm run debug     # ng serve with /graphql proxied to the API
```

Open <http://localhost:4200>.

## Scripts

**Client** (`src/client`)

| Command | Description |
|---|---|
| `npm start` | Dev server |
| `npm run debug` | Dev server with the API proxy |
| `npm run build` | Production build |
| `npm test` | Unit tests (Karma + Jasmine) |
| `npm run lint` | ESLint |
| `npm run format` | Prettier + ESLint + Stylelint autofix |

**Server** (`src/server`)

| Command | Description |
|---|---|
| `npm run create-tables` | Create all database tables |
| `npm run dev` | Run with hot reload (`ts-node-dev`) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run format` | Prettier + ESLint autofix |

## API

The API is a single GraphQL endpoint at `/graphql`. Authenticated operations expect the header `Authorization: Bearer <accessToken>`.

| Area | Operations |
|---|---|
| Auth & account | `signIn`, `refreshAccessToken`, `createUser`, `confirmEmail`, `recoverPassword`, `resetPassword`, `setNewPassword`, `changePassword`, `userWithEmailExists`, `userWithUsernameExists`, `userWithRecoveryCodeExists`, `userEssentials` |
| Opinions | `getGeneralOpinions`, `getOpinionsByUserId`, `createOpinion`, `deleteOpinion`, `reactToOpinion` |
| Favorites | `getFavoritesByUserId`, `addOpinionToFavorites`, `removeOpinionFromFavorites` |
| Profile & search | `userProfile`, `editProfile`, `userSearch` |
| Followers | `followUser`, `unfollowUser`, `acceptFollowRequest`, `declineFollowRequest` |
| Messages | `sendUserMessage`, `fetchUserMessages`, `fetchNewUserMessages`, `fetchUserConversation`, `checkConversationMessageStatus`, `sendUserSavedMessage`, `fetchUserSavedMessages` |
| Notifications | `userNotifications`, `deleteUserNotification`, `checkUserStatus` |
| Settings | `userSettings`, `updateUserSettings` |
| App | `getServerTimestamp` |

To try the API, import the collection and environment from `postman/` into Postman.

## Roadmap

- [ ] Vertical swipes: swipe up to agree with a comment, swipe down to disagree with a comment
- [ ] "Follow @username" call-to-action when a profile tab is restricted to followers
- [ ] **TOPinions:** recent opinions getting the most attention
- [ ] **Trends:** agree/disagree statistics per tag
- [ ] **Fellow thinkers:** people who react the way you do
- [ ] Scoped opinion links (`/opinion/:id?scope=user|reactions|favorites`) that keep browsing within that pool
- [ ] Audio and video reactions
- [ ] Move configuration and secrets to environment variables
