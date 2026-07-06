# Knowledge Base

個人知識庫靜態網站。筆記用 HTML 寫(方便 AI 生成),host 喺 AWS S3 + CloudFront,merge 入 `main` 會由 GitHub Actions 自動 deploy。

## 結構

```
site/                          # 會 sync 上 S3 嘅所有嘢
  index.html                   # 首頁(搜尋 / 分類 filter / 中英切換)
  notes.json                   # 筆記 manifest,首頁靠佢 render 列表
  assets/style.css             # 共用樣式(首頁 + 筆記頁)
  assets/app.js                # 首頁邏輯
  notes/<category>/<id>.zh.html   # 中文版筆記
  notes/<category>/<id>.en.html   # 英文版筆記
templates/note-template.zh.html  # 新筆記 copy 呢個開始(唔會 deploy)
.github/workflows/deploy.yml   # CI/CD
serve.go                       # 本地 preview server(go run serve.go)
CLAUDE.md                      # 畀 AI 睇嘅筆記規範
```

## 本地 preview

因為 `index.html` 要 fetch `notes.json`,直接開檔案會被 CORS 擋,要起個 local server:

```bash
go run serve.go
# 開 http://localhost:8000
```

## 加新筆記

1. Copy `templates/note-template.zh.html` 去 `site/notes/<category>/<id>.zh.html`,寫內容(想要英文版就多開一個 `<id>.en.html`)。
2. 喺 `site/notes.json` 加一個 entry(見檔案內例子)。
3. Merge 入 `main` 就會自動上線。

分類:`web3` / `defi` / `crypto` / `investing` / `tech` / `deployment`(加新分類只需喺 notes.json 用新名,首頁會自動出現)。

## AWS 一次性設定

詳細步驟見第一篇筆記:[Deploy to AWS](site/notes/deployment/deploy-to-aws.zh.html)(佢本身就係呢個 site 嘅部署教學)。概要:

1. 開一個 private S3 bucket(block all public access)。
2. 開 CloudFront distribution,用 OAC(Origin Access Control)指去個 bucket,default root object 設 `index.html`。
3. 喺 IAM 開 GitHub OIDC provider + 一個限定呢個 repo 嘅 deploy role。
4. 喺 GitHub repo 設定 secrets:
   - `AWS_DEPLOY_ROLE_ARN` — IAM role ARN
   - `AWS_REGION` — 例如 `ap-southeast-1`
   - `S3_BUCKET` — bucket 名
   - `CLOUDFRONT_DISTRIBUTION_ID` — distribution ID
