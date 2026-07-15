import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const pagePath = join(
  process.cwd(),
  "src",
  "app",
  "blog",
  "vatandaslik-maasi-2026-kimler-yararlanacak-basvuru-sartlari-ve-tutarlar-belli-oldu",
  "page.tsx",
);

const page = readFileSync(pagePath, "utf8");

test("unverified P0 Resmi Gazete citation is removed", () => {
  assert.doesNotMatch(page, /Sayı:\s*33700/i);
  assert.doesNotMatch(
    page,
    /2022 Sayılı Kanun.*Eklenmesi Planlanan/s,
  );
  assert.doesNotMatch(
    page,
    /T\.C\. Resmî Gazete\.\s*\(2025\)/,
  );
});

test("remaining bibliography entries are sequential", () => {
  assert.match(
    page,
    /\[1\]\s*Cumhurbaşkanlığı Strateji ve Bütçe Başkanlığı/,
  );
  assert.match(
    page,
    /\[2\]\s*Aile ve Sosyal Hizmetler Bakanlığı/,
  );
  assert.match(page, /\[3\]\s*Dünya Bankası/);
  assert.doesNotMatch(page, /\[4\]\s*Dünya Bankası/);
});

test("article does not present an official draft or active program", () => {
  assert.match(
    page,
    /Şu an için yürürlüğe girmiş resmî bir program bulunmamaktadır\./,
  );
  assert.match(
    page,
    /resmî hak,\s*resmî taslak veya başvuru şartı değildir:/,
  );
  assert.match(
    page,
    /Kamuoyundaki Politika Önerileri/,
  );
  assert.doesNotMatch(
    page,
    /Taslak Çerçeve ve Uygulama Notları/,
  );
});

test("article keeps the noindex quarantine boundary", () => {
  assert.match(page, /index:\s*false/);
  assert.match(page, /follow:\s*false/);
});
