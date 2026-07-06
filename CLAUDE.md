# Knowledge Base — AI 筆記規範

呢個 repo 係個人知識庫靜態網站(S3 + CloudFront host,merge main 自動 deploy)。筆記全部係純 HTML,冇 build step。

## 寫新筆記時

1. 從 `templates/note-template.zh.html` copy 做起點。
2. 檔案路徑:`site/notes/<category>/<id>.zh.html`(中文)/ `site/notes/<category>/<id>.en.html`(英文)。`<id>` 用 kebab-case。
3. 每篇筆記**必須**同步喺 `site/notes.json` 加 entry,格式:

```json
{
  "id": "deploy-to-aws",
  "title": { "zh": "部署靜態網站到 AWS", "en": "Deploy a Static Site to AWS" },
  "category": "deployment",
  "tags": ["aws", "s3", "cicd"],
  "date": "2026-07-06",
  "langs": ["zh", "en"],
  "path": "notes/deployment/deploy-to-aws"
}
```

`path` 唔包 `.zh.html` 後綴;`langs` 填實際有嘅語言版本。
4. 中文係主要語言;英文版有時間先寫,冇就 `langs` 只填 `["zh"]`。
5. 分類:`web3` / `defi` / `crypto` / `investing` / `tech` / `deployment`。加新分類直接喺 notes.json 用新名即可。

## 筆記內容風格

- 開頭有「TL;DR」段,三五句講清楚重點 — 方便日後溫習。
- 用 `<h2>` 分 section;code 用 `<pre><code>`;重要概念用 `<strong>` 或 callout(`<div class="callout">`)。
- 結尾有「參考 References」section 放 link。
- 語言 switcher link 已喺 template 度,兩個語言版本互相連結。

## 其他

- 只有 `site/` 會 deploy;`templates/`、`README.md`、`CLAUDE.md` 唔會上線。
- **Tooling 語言:Go 優先(其次 Node.js/TS 或 Rust),唔用 Python** — 包括 scripts、local server、CI steps。本地 preview 用 `go run serve.go`。
- 唔好自動 git commit,除非用戶明確要求。
