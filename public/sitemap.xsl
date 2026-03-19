<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>XML Sitemap | favIMG</title>
        <style>
          :root {
            --bg-1: #f8fafc;
            --bg-2: #eef2ff;
            --card: #ffffff;
            --text: #0f172a;
            --muted: #64748b;
            --line: #e2e8f0;
            --head: #f1f5f9;
            --accent: #2563eb;
            --accent-soft: #dbeafe;
          }

          body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.5;
            background: radial-gradient(circle at 15% 10%, var(--bg-2) 0%, var(--bg-1) 45%, #f8fafc 100%);
            color: var(--text);
          }

          .wrap {
            max-width: 1100px;
            margin: 32px auto;
            padding: 0 16px;
          }

          h1 {
            margin: 0;
            font-size: 28px;
            letter-spacing: -0.02em;
          }

          .topbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 14px;
            margin: 0 0 16px;
          }

          .total-urls {
            color: var(--muted);
            font-size: 14px;
            white-space: nowrap;
          }

          .total-urls strong {
            color: var(--accent);
            background: var(--accent-soft);
            border: 1px solid #bfdbfe;
            border-radius: 999px;
            padding: 3px 10px;
          }

          .th-title {
            display: inline-flex;
            align-items: center;
            gap: 6px;
          }

          .th-controls {
            display: inline-flex;
            gap: 4px;
          }

          .th-sort {
            border: 1px solid #cbd5e1;
            background: #ffffff;
            color: #475569;
            border-radius: 6px;
            width: 22px;
            height: 22px;
            line-height: 20px;
            text-align: center;
            font-size: 12px;
            padding: 0;
            cursor: pointer;
          }

          .th-sort:hover {
            background: #eff6ff;
            border-color: #93c5fd;
          }

          .th-sort.active {
            border-color: var(--accent);
            color: #1e40af;
            background: var(--accent-soft);
          }

          .card {
            background: var(--card);
            border: 1px solid var(--line);
            border-radius: 14px;
            overflow: hidden;
            box-shadow: 0 10px 24px rgba(15, 23, 42, 0.07);
          }

          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
          }

          thead th {
            text-align: left;
            background: var(--head);
            padding: 12px 14px;
            border-bottom: 1px solid var(--line);
            white-space: nowrap;
          }

          tbody td {
            padding: 12px 14px;
            border-bottom: 1px solid #edf2f7;
            vertical-align: top;
          }

          tbody tr:nth-child(even) {
            background: #fcfdff;
          }

          tbody tr:hover {
            background: #f8fbff;
          }

          tbody tr:last-child td {
            border-bottom: none;
          }

          .url {
            word-break: break-all;
          }

          a {
            color: var(--accent);
            text-decoration: none;
            font-weight: 500;
          }

          a:hover {
            text-decoration: underline;
          }

          @media (max-width: 820px) {
            .topbar {
              flex-direction: column;
              align-items: flex-start;
            }

            thead {
              display: none;
            }

            table,
            tbody,
            tr,
            td {
              display: block;
              width: 100%;
            }

            tbody tr {
              border-bottom: 1px solid var(--line);
              padding: 10px 0;
            }

            tbody tr:last-child {
              border-bottom: none;
            }

            tbody td {
              border: none;
              padding: 6px 12px;
            }

            tbody td::before {
              content: attr(data-label) ": ";
              font-weight: 600;
              color: #334155;
            }
          }
        </style>
      </head>
      <body>
        <div class="wrap">
          <div class="topbar">
            <h1>XML Sitemap</h1>
            <div class="total-urls">Total URLs: <strong><xsl:value-of select="count(s:urlset/s:url)"/></strong></div>
          </div>

          <div class="card">
            <table>
              <thead>
                <tr>
                  <th>URL</th>
                  <th>
                    <span class="th-title">Last Modified
                      <span class="th-controls">
                        <button class="th-sort" type="button" data-sort="lastmod" data-order="asc" aria-label="Sort Last Modified Ascending">↑</button>
                        <button class="th-sort" type="button" data-sort="lastmod" data-order="desc" aria-label="Sort Last Modified Descending">↓</button>
                      </span>
                    </span>
                  </th>
                  <th>
                    <span class="th-title">Change Frequency
                      <span class="th-controls">
                        <button class="th-sort" type="button" data-sort="changefreq" data-order="asc" aria-label="Sort Change Frequency Ascending">↑</button>
                        <button class="th-sort" type="button" data-sort="changefreq" data-order="desc" aria-label="Sort Change Frequency Descending">↓</button>
                      </span>
                    </span>
                  </th>
                  <th>
                    <span class="th-title">Priority
                      <span class="th-controls">
                        <button class="th-sort" type="button" data-sort="priority" data-order="asc" aria-label="Sort Priority Ascending">↑</button>
                        <button class="th-sort" type="button" data-sort="priority" data-order="desc" aria-label="Sort Priority Descending">↓</button>
                      </span>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody id="sitemapRows">
                <xsl:for-each select="s:urlset/s:url">
                  <tr>
                    <td class="url" data-label="URL">
                      <a href="{s:loc}"><xsl:value-of select="s:loc"/></a>
                    </td>
                    <td data-label="Last Modified"><xsl:value-of select="s:lastmod"/></td>
                    <td data-label="Change Frequency"><xsl:value-of select="s:changefreq"/></td>
                    <td data-label="Priority"><xsl:value-of select="s:priority"/></td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>
        </div>

        <script><![CDATA[
          (function () {
            const tbody = document.getElementById('sitemapRows');
            const buttons = Array.from(document.querySelectorAll('.th-sort'));
            if (!tbody || !buttons.length) {
              return;
            }

            const freqOrder = {
              always: 0,
              hourly: 1,
              daily: 2,
              weekly: 3,
              monthly: 4,
              yearly: 5,
              never: 6
            };

            function getRowValue(row, key) {
              const cells = row.children;
              if (key === 'lastmod') {
                const value = (cells[1]?.textContent || '').trim();
                const time = Date.parse(value);
                return Number.isNaN(time) ? 0 : time;
              }
              if (key === 'changefreq') {
                const value = (cells[2]?.textContent || '').trim().toLowerCase();
                return Object.prototype.hasOwnProperty.call(freqOrder, value) ? freqOrder[value] : 999;
              }
              if (key === 'priority') {
                const value = parseFloat((cells[3]?.textContent || '').trim());
                return Number.isNaN(value) ? 0 : value;
              }
              return 0;
            }

            function sortRows(key, order) {
              const rows = Array.from(tbody.querySelectorAll('tr'));
              rows.sort(function (a, b) {
                const va = getRowValue(a, key);
                const vb = getRowValue(b, key);
                if (va < vb) return order === 'asc' ? -1 : 1;
                if (va > vb) return order === 'asc' ? 1 : -1;
                return 0;
              });
              rows.forEach(function (row) { tbody.appendChild(row); });
            }

            buttons.forEach(function (btn) {
              btn.addEventListener('click', function () {
                const key = btn.getAttribute('data-sort');
                const order = btn.getAttribute('data-order');
                buttons.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                sortRows(key, order);
              });
            });
          })();
        ]]></script>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
