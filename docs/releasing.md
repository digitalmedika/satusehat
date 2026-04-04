# Releasing

Repo ini memakai [Changesets](https://github.com/changesets/changesets) untuk:

- generate release notes
- membuat release pull request otomatis
- publish package ke npm
- membuat GitHub Release setiap publish berhasil

## Setup GitHub Secrets

Tambahkan secret berikut di repository GitHub:

- `NPM_TOKEN`: token npm dengan hak publish ke package `@digitalmedika/satusehat`

`GITHUB_TOKEN` sudah disediakan otomatis oleh GitHub Actions.

## Cara pakai

1. Setiap ada perubahan yang ingin masuk release, jalankan:

```bash
bun run changeset
```

2. Isi ringkasan perubahan. Isi ini akan dipakai sebagai release notes.

3. Commit file markdown yang dibuat di folder `.changeset/`.

4. Setelah changeset masuk ke branch `main`, workflow `Release` akan membuat atau mengupdate release pull request.

5. Merge release pull request tersebut. Setelah merge:

- versi di `package.json` akan dipakai untuk publish ke npm
- `CHANGELOG.md` akan terupdate
- GitHub Release akan dibuat

## Release Notes

Sumber release notes berasal dari file changeset markdown yang kamu tulis. Jadi format paling aman adalah ringkas dan fokus pada perubahan user-facing, misalnya:

```md
### Added

- tambah helper baru untuk builder encounter rawat inap

### Fixed

- perbaiki validasi token cache file saat expiry kosong
```
