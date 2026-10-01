# Cubo Mobile: product catalogue

A product browsing app built with **React** and **TypeScript** on the public [DummyJSON](https://dummyjson.com/docs/products) API. Browse, search, filter, sort and page through products, open a product, edit its title and price, shortlist up to four products and compare them side by side.

**Repository:** https://github.com/AnasGhnaim/Cubo-frontend-test

---

## Contents

1. [Features](#features)
2. [Tech stack](#tech-stack)
3. [Getting started](#getting-started)
4. [Project structure](#project-structure)
5. [How the data flows](#how-the-data-flows)
6. [Decisions and reasoning](#decisions-and-reasoning)
7. [Assumptions](#assumptions)

---

## Features

### Product catalogue (`/`)
Browse every product in a responsive grid (2 columns on phones, up to 4 on large screens) with a short introduction at the top.

- **Search** by product title or brand.
- **Filter by category** from a custom dropdown with all 24 categories, which always opens below its button and scrolls.
- **Sort** by price (low to high, high to low) or by top rated.
- **Pagination** with Previous / Next buttons, 12 products per page, taken from the API's real total.
- Each card shows the image, category, title, brand, rating, price and a heart button to shortlist the product.

**How it's built:** the filters and page number live in the URL (React Router's `useSearchParams`), and each combination is its own React Query cache entry. A Zod schema validates every response before it reaches the UI.

### Shareable links and history
Every view has a link. Copy the address of a filtered, sorted, searched, page-3 view, open it in another tab, and you get exactly the same results with the same controls filled in. The browser's Back and Forward buttons step through the views you visited, and refresh keeps your place.

**How it's built:** `params.ts` converts between the URL and a typed params object, falling back to sensible defaults for anything missing or invalid, so even a hand-edited link opens a working view. Default values are left out of the URL to keep links short.

### Search as you type
Results always match what is in the search box, and typing fast does not flood the API: typing "phone" sends one request, not five.

**How it's built:**
- A 500 ms **debounce** (`useDebounce`) waits for a pause before the text reaches the URL and triggers a request.
- React Query hands each request an `AbortSignal`, and axios uses it to **cancel** the previous request when a newer one starts. A slow old response can never overwrite a newer one.
- While the results are catching up with the input, the grid is dimmed and marked `aria-busy`.

### Product detail (`/products/:id`)
A page for a single product with an **image gallery** with thumbnails, price, stock status, rating, description and tags, plus a **reviews section**: the average rating, a 5-to-1 star breakdown and review cards with reviewer, date, stars and comment. On large screens the summary stays in view beside the reviews. It works on a direct visit and on refresh, and an id that does not exist shows a "Product not found" screen.

**How it's built:** the id comes from the URL (`useParams`) and the product is loaded with React Query. An id that is not a positive number never reaches the API.

### Editing a product
Edit a product's **title and price** from a dialog on the detail page. The form validates as you submit, shows a clear message under the field, and moves focus to the first problem. On save the dialog closes at once and the new values appear everywhere immediately, on the detail page, in the catalogue, in the shortlist and in the compare table. A toast confirms success.

**How it's built:** a **Zod** schema validates the form, and a React Query **mutation** does an *optimistic update*: it writes the new values into every cached copy of the product, then sends the `PUT`. If the request fails, every copy is restored and a toast explains what happened, so the app is never left half-updated. The Edit button is disabled while a save is in flight, and saving without changes sends nothing. The dialog is shadcn/ui on **Base UI**: it moves focus into the form when it opens and closes on Escape.

### Shortlist (`/shortlist`)
Shortlist up to **four** products with the heart on any card or the button on the detail page. The count shows in the header on every page, and the shortlist page lists your products with a remove button on each (cards on phones, rows on wider screens). Trying to add a fifth shows a toast.

- **Survives a refresh:** your shortlist is saved in the browser.
- **Stays in sync across tabs:** add or remove in one tab and every other open tab updates immediately, with no reload.

**How it's built:** a **Zustand** store holds only the product ids, with the `persist` middleware writing them to `localStorage`. What is read back is validated with Zod and trimmed to four. A `storage` event listener reloads the store whenever another tab writes. The product details come from the shared React Query cache.

### Compare (`/compare`)
Put the shortlisted products side by side: image, price, rating, stock, brand and category. The **cheapest** price and the **best rated** product get a "Best value" badge. On wide screens it is a table, on phones it becomes one card per product, and each product can be removed from the comparison.

**How it's built:** `getHighlights` finds the lowest price and the highest rating in one pass, and both the table and the cards read the same row definitions, so the highlight logic exists once.

### Resilience
- **Failed requests** show an error screen with a **Try again** button. Network errors and server errors are retried automatically twice, but not client errors such as a 404.
- **Slow network:** requests time out after 10 seconds instead of hanging, with a loading state while waiting.
- **Empty states** for no search results, an empty shortlist, nothing to compare, a page number past the end, and an unknown category.
- **Error boundaries** isolate independent sections, so a crash in one shows a small message in its place and the rest keeps working. They wrap each page, the header badge, the catalogue filters, the catalogue results, every product card, the reviews and the edit dialog. A router-level screen is the last resort.

### Performance
Interacting with the shortlist does not re-render the rest of the app. Each component subscribes only to what it needs: a heart button to "is *my* product shortlisted", the header badge to the count. Product cards are wrapped in `memo`. In the browser, clicking one heart re-rendered only that heart and the badge, and typing in the search box re-rendered the page but none of the twelve cards.

### Accessibility
- Every control has a real label, including icon buttons such as the heart, remove and close buttons.
- Operable with the keyboard: the dropdowns open with Enter, move with the arrow keys and close with Escape (focus returns to the button), and the dialog, gallery thumbnails and pagination are real buttons you can reach with Tab. Inputs, dropdowns and buttons show a visible focus ring.
- Form errors are announced (`role="alert"`) and tied to their field (`aria-invalid`, `aria-describedby`).
- Result counts are announced (`role="status"`), and star ratings have text for screen readers (for example "4 out of 5").
- The image gallery marks the selected thumbnail, and dates use the `<time>` element.

### Design
A dark-blue theme with every colour defined once as a token in `src/index.css`. The layout is responsive from phones to wide screens, with a sticky header, glass-style cards, a soft blue glow on hover, white image backgrounds for product photos, and the Space Grotesk font.

---

## Tech stack

| Area | Tool | How it is used |
|---|---|---|
| Framework | **React 19** + **TypeScript 6** | TypeScript throughout, with no `any`. |
| Build tool | **Vite 8** | Dev server and production build. |
| Styling | **Tailwind CSS 4** | A custom dark-blue theme of design tokens (`bg-card`, `text-primary`...) so no colour is hard-coded. |
| UI components | **shadcn/ui** on **Base UI** | Accessible dialog and select, plus button, card and badge. |
| Icons | **lucide-react** | |
| Routing | **React Router 8** | One route per view, a shared layout route for the header, and URL search params for catalogue state. |
| Server data | **TanStack React Query 5** | Caching, request cancellation, retries, loading and error states, and the optimistic edit. |
| HTTP | **axios** | A single client with a timeout and one error type (`ApiError`). |
| Validation | **Zod 4** | Validates API responses, the edit form and the data read back from `localStorage`. |
| Client state | **Zustand 5** with `persist` | The shortlist: persisted and synced across tabs. |
| Notifications | **Sonner** | Success and error toasts. |

---

## Getting started

You need **Node 20.19+** (or 22.12+) and npm.

```bash
npm install
npm run dev       # http://localhost:5173
```

| Script | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check (`tsc -b`) and build for production |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

No API key, `.env` file or backend is needed.

> In development each request appears twice in the Network tab, with the first one marked "canceled". That is React StrictMode mounting components twice on purpose, and it does not happen in a production build.

---

## Project structure

The app is a **modular monolith**: one app split into feature modules. Each module owns its pages, components and state, and exposes a small public surface through its `index.ts`. Other modules import only from that file.

```
src/
├── api/                  Everything that talks to the network
│   ├── client.ts           axios instance (10s timeout, one error type)
│   ├── errors.ts           ApiError class and isNotFound()
│   ├── schemas.ts          Zod schemas; the Product type is derived from them
│   ├── products.ts         Requests and React Query definitions
│   └── useProductsByIds.ts Loads several products by id (shortlist, compare)
├── features/
│   ├── catalog/            Product list: intro, search, filters, pagination
│   ├── product/            Product detail, reviews, edit dialog
│   ├── shortlist/          Store, heart button, header badge, shortlist page
│   └── compare/            Compare page and the "best value" logic
├── components/           Shared UI that knows nothing about features
│   └── ui/                 shadcn components (button, dialog, select, ...)
├── lib/                  queryClient, useDebounce, cn()
├── routes.tsx            Router, layout and error boundaries
├── main.tsx              Entry point
└── index.css             Theme tokens
```

Two rules keep the modules separate:

- Feature code imports other features only through their `index.ts`.
- Shared `components/` never import from a feature. For example, the header receives the shortlist badge as a prop.

---

## How the data flows

```
 URL ──► Page component ──► React Query (cache) ──► axios ──► DummyJSON
  ▲            │                      │
  │            ▼                      ▼
  └──── user actions          loading / error / data
```

1. A page reads its inputs from the URL and asks React Query for the data.
2. React Query returns it from the cache or calls axios, which requests DummyJSON.
3. The response is validated with Zod, so components only ever see data of the expected shape.
4. The page renders one of: loading, error, empty or results.
5. User actions change the URL (or call a mutation), which changes the query and updates the screen.

**Which endpoint the catalogue uses:**

| Search | Category | Endpoint |
|---|---|---|
| no | no | `/products` |
| yes | no | `/products/search` |
| no | yes | `/products/category/{slug}` |
| yes | yes | `/products/category/{slug}` (whole category), filtered and paged in the app |

---

## Decisions and reasoning

- **The URL is the source of truth for the catalogue.** Sharing, refresh and back/forward work with almost no extra code, and there is never a second copy of the state to keep in sync.
- **One history entry per settled change.** Back steps through the views the user really saw, and typing is debounced first, so a search does not create an entry per letter.
- **Search plus category works together.** DummyJSON cannot combine them in one request, so the app fetches the whole category (it is small) and filters and pages it locally.
- **Results are dimmed, not hidden, while out of date.** The previous results stay visible, with no flashing empty screen, but the interface does not claim they match what is in the input.
- **Optimistic update with rollback.** The interface responds immediately, and a snapshot of every cached copy is restored if the save fails, so the app is never inconsistent.
- **The shortlist stores ids, not products.** Ids are tiny and never go out of date. Product data comes from the shared cache, so an edit shows up everywhere.
- **Zod at every boundary.** API responses, the edit form and `localStorage` are all untrusted input, so each is validated once where it enters the app.
- **A 5-minute stale time** means moving between pages reuses cached data instead of refetching.
- **Compare highlights the two things that matter:** the cheapest price and the best rating.
- **Error boundaries around independent sections**, as a small class component (`components/ErrorBoundary.tsx`), since React has no hook for catching render errors.
- **Simple code on purpose.** No `useMemo` where the work is cheap and no extra abstractions, so every part is easy to follow and change.

---

## Assumptions

- **DummyJSON simulates writes.** A `PUT` returns the edited product but the API does not store it. The app keeps the edit in its cache, so it shows everywhere while you use the app.
- **A product with no brand is valid.** Some DummyJSON products have none, so the brand is optional and hidden when missing.
- **Category slugs from the API** are used in the URL (`?category=mobile-accessories`) and shown with their display names.
- **The shortlist belongs to the browser,** not to an account, so it is stored in `localStorage`.
- **"Best rated"** means the highest `rating` field and **"cheapest"** the lowest `price`. Ties are both marked.
