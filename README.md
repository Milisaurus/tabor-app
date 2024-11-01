# 🏕️ *Táborová bodovací webová aplikace*🏕️

## Obecný popis projektu
Aplikace umožňuje vedoucím na táboře snadno sledovat výsledky týmů, zadávat body za soutěže a hry, a vyhlašovat denní i celkové vítěze. ***Cílem je zjednodušit organizaci bodování, zamezit ručním výpočtům a nabídnout přehledné a snadno přístupné zobrazení výsledků prostřednictvím webového rozhraní.***

---

## 🌟 Klíčové funkce aplikace

> Toto je aktuální koncept funkcí, který se může rozšířit nebo upravit podle potřeb a zkušeností z vývoje.

### 1. Správa týmů
   - 📝 ***Vytváření a správa týmů*** s detaily jako název, vedoucí, a členové.
   - ✏️ Možnost ***upravovat*** nebo ***mazat existující týmy***.

### 2. Zadávání bodů a výsledků her
   - 🎯 ***Formulář pro zadávání bodů*** za jednotlivé hry, kde každý tým obdrží své bodové ohodnocení.
   - ⭐ ***Bonusové body*** nebo speciální ocenění pro ***vybrané týmy či jednotlivé účastníky***.
   - 🧮 ***Automatická pravidla*** pro bodování: Možnost nastavit pravidla, která automaticky přidělují body na základě různých kritérií (délka hry - kratší / delší).
   - 🔄 ***Automatická aktualizace*** celkového skóre týmů po každé změně.

### 3. Vizualizace výsledků
   - 📊 ***Žebříček týmů*** na základě aktuálních výsledků.
   - 📈 ***Grafické zobrazení*** bodů pomocí grafů a progress barů.

### 4. Zobrazení historie her
   - 📅 Možnost ***zobrazení odehraných her*** a výsledků za jednotlivé dny.
   - 🔍 ***Podrobnosti o konkrétní hře*** s možností editace nebo smazání v případě chybného zadání.

### 5. Ukládání a načítání dat
   - 💾 Data se ukládají ve formátu ***JSON nebo XML***, což umožňuje snadnou manipulaci bez potřeby databáze.
   - 🖥️ ***Data jsou dostupná na serveru***, což umožňuje sdílený přístup více vedoucím.

### 6. Možné rozšíření
> Pouze návrhy pro budoucí vylepšení, která nejsou nutná, ale mohou být užitečná.

- 📅 ***Integrace kalendáře aktivit*** s připomenutím a notifikacemi o nadcházejících událostech (např. další hry).
- 📄 ***Seznam všech her*** kde by si mohli vedoucí ukládat nápady na jednotlivé hry.
- 📱 ***Mobilní platforma***, podpora mobilních zařízení pomocí responzivního CSS.
- 🕒 ***Zobrazení denních statistik:*** Možnost zobrazit nejaktivnější den, tým s nejvíce body za den a podobně.
- ...

---

## 💻 Použité technologie
> Možný návrh technologií pro front-end i back-end řešení.

### Frontend
- **HTML/CSS**: Struktura a styl webových stránek, formuláře, případně interaktivní prvky v **JavaScriptu**.
- **[Bootstrap](https://getbootstrap.com/)**: Framework pro responzivní návrh UI a styling, včetně šablon pro formuláře, navigaci a rozložení stránky.

### Backend
- **PHP**: Serverová strana aplikace, která pracuje s daty a komunikuje s frontendem.
- **Formáty ukládání dat**: JSON nebo XML pro ukládání a načítání dat.

---

## 🚀 Instalace a spuštění

1. Naklonujte tento repozitář:
    ```bash
    git clone https://github.com/Milisaurus/ITU-projekt.git
    ```
