# letterboxd-proxy

A simple Cloudflare Worker that fetches a **Letterboxd list** and returns it as a **CSV** or **JSON** with CORS enabled.

---

## 🔧 Usage
`https://letterboxd-proxy.<your-subdomain>.workers.dev/?url=https://letterboxd.com/<user>/list/<list-name>/`

**CSV output (default):**

Rank,Title,LetterboxdURI

1,Midsommar,https://letterboxd.com/film/midsommar/

2,Sinners,https://letterboxd.com/film/sinners-2025/


Add `&format=json` for JSON output.

---

## 🚀 Deploy

```bash
npm i -g wrangler
wrangler login
wrangler deploy

wrangler deploy
```
If prompted, register a workers.dev subdomain.
Your Worker will be available at:
`https://letterboxd-proxy.<your-subdomain>.workers.dev`

## 🧠 Notes

- Parses <div data-component-class="LazyPoster" ...> entries from Letterboxd lists.
  
- Adds Access-Control-Allow-Origin: * for browser use.
  
- Works great for static sites needing Letterboxd data without a backend.

MIT License
