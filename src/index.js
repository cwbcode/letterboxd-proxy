export default {
  async fetch(req) {
    const url = new URL(req.url);
    const target = url.searchParams.get("url");
    if (!target) return new Response("Missing ?url=", { status: 400 });

    const res = await fetch(target, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    const html = await res.text();

    // Handles both single and double quotes
    const filmRegex =
      /data-component-class=['"]LazyPoster['"][^>]+data-item-name=['"]([^'"]+)['"][^>]+data-item-link=['"]([^'"]+)['"][^>]+data-postered-identifier=['"]([^'"]+)['"]/g;

    const films = [];
    const seen = new Set();
    let match;
    let rank = 1;

    while ((match = filmRegex.exec(html)) !== null) {
      const titleRaw = match[1]; // e.g. Terrified (2017)
      const link = match[2]; // e.g. /film/terrified-2017/
      const identifier = match[3]; // e.g. {'lid':'hCyy', ...}
      const lidMatch = /"lid":"([^"]+)"/.exec(identifier) || /'lid':'([^']+)'/.exec(identifier);
      const lid = lidMatch ? lidMatch[1] : null;

      const title = titleRaw.replace(/\s*\(\d{4}\)\s*$/, "");
      const fullUrl = `https://letterboxd.com${link}`;
      const boxdUrl = lid ? `https://boxd.it/${lid}` : fullUrl;

      if (seen.has(fullUrl)) continue;
      seen.add(fullUrl);

      films.push({ rank: rank++, title, uri: fullUrl, short: boxdUrl });
    }

    const csvLines = ["Rank,Title,LetterboxdURI"];
    for (const f of films) {
      const safeTitle = `"${f.title.replace(/"/g, '""')}"`;
      csvLines.push(`${f.rank},${safeTitle},${f.uri}`);
    }

    const csv = csvLines.join("\n");

    if (films.length === 0) {
      console.log("No matches found. Sample:", html.slice(0, 500));
    }

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=300",
      },
    });
  },
};
