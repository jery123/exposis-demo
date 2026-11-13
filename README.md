# EXPOSIS website

The Next.js public website lives in this folder. The Laravel application in
[`../exposis-web`](../exposis-web) remains the data and workflow backend for
member accounts, project submissions, evaluation, moderation, and email
notifications.

## What is included

- Responsive French-language public site using the supplied EXPOSIS logos.
- Searchable public project catalogue with domain filters, published team
  members, and individual project detail pages.
- Account-free feasibility, prototype, and research submission form.
- Authenticated member project proposal form at
  `/communaute/projets/nouveau`; members can submit completed projects with an
  optional project link and up to five images. Submissions and images stay
  private until admin review and publication.
- Native Next.js member login and registration pages. Credentials and sessions
  continue to be validated and managed securely by Laravel; password recovery
  and member/admin workflows remain served by Laravel.

Projects are read through Laravel's public API. New visitor submissions are
posted to Laravel and stay in the existing private admin review queue. Member
projects continue to require admin publication before they appear publicly.

## Run locally

Start the backend first:

```sh
cd ../exposis-web
php artisan serve
```

In another terminal, from this folder:

```sh
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Set `LARAVEL_API_URL` and
`LARAVEL_APP_URL` in `.env.local` if the Laravel backend is not at
`http://127.0.0.1:8000`. The app proxies authentication form requests and member/admin paths to Laravel
so member sessions continue to use the existing backend.

## Validate

```sh
npm run lint
npm run typecheck
npm run build
```

Configure Laravel mail and `EXPOSIS_INBOX` in the backend environment to receive
new submission notifications. See the backend [setup instructions](../exposis-web/README.md).
