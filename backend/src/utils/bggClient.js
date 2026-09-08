// [14] BoardGameGeek, "Using the XML API," BoardGameGeek Wiki.
const BGG_BASE = "https://boardgamegeek.com/xmlapi2";

function decodeEntities(str) {
    if (!str) return str;
    return str.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

function roundOneDecimal(value) {
    if (!value) return value;
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return num.toFixed(1);
}

function extract(xml, regex) {
    const match = xml.match(regex);
    return match ? decodeEntities(match[1]) : null;
}

async function getGameById(gameId) {
    const res = await fetch(`${BGG_BASE}/thing?id=${gameId}&stats=1`, {
        headers: { Authorization: `Bearer ${process.env.BGG_TOKEN}` },
    });
    if (!res.ok) throw new Error(`BGG request failed: ${res.status}`);
    const xml = await res.text();

    const name = extract(xml, /<name type="primary"[^>]*value="([^"]*)"/);
    if (!name) return null;

    return {
        gameId: String(gameId),
        name,
        yearPublished: extract(xml, /<yearpublished value="([^"]*)"/),
        minPlayers: extract(xml, /<minplayers value="([^"]*)"/),
        maxPlayers: extract(xml, /<maxplayers value="([^"]*)"/),
        rating: roundOneDecimal(extract(xml, /<average value="([^"]*)"/)),
        complexity: roundOneDecimal(extract(xml, /<averageweight value="([^"]*)"/)),
    };
}

module.exports = { getGameById };