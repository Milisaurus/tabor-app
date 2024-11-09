# 🏕️ *Táborová bodovací webová aplikace*🏕️

## Obecný popis projektu
Aplikace umožňuje vedoucím na táboře snadno sledovat výsledky týmů, zadávat body za soutěže a hry, a vyhlašovat denní i celkové vítěze. ***Cílem je zjednodušit organizaci bodování, zamezit ručním výpočtům a nabídnout přehledné a snadno přístupné zobrazení výsledků prostřednictvím webového rozhraní.***

---

## 🌟 Klíčové funkce aplikace

> Toto je aktuální koncept funkcí, který se může rozšířit nebo upravit podle potřeb a zkušeností z vývoje.

### 1. Správa týmů
   - 📝 ***Vytváření a správa týmů*** s detaily jako název, barva týmu, vedoucí, a členové.
   - ✏️ Možnost ***upravovat*** nebo ***mazat existující týmy***.
   > Upravovat a mazat je záležitost diskuze, dělalo by to problém na poli ukládání dat

### 2. Zadávání bodů a výsledků her
   - 🎯 ***Formulář pro zadávání bodů*** za jednotlivé hry, kde každý tým obdrží své bodové ohodnocení.
      - 🧮 ***Automatická pravidla*** pro bodování: Na výběr bude že 3 možností bodování, které se budou dát upravit (nastavení vlastního bodování). Po změně bodování jedné z možností se změní bodování za dané hry s vybranou možností bodování (Méně bodovaná, Více bodovaná, Velmi bodovaná). 
   - ⭐ ***Bonusové body*** nebo speciální ocenění pro ***vybrané týmy či jednotlivé účastníky***.
   - 🔄 ***Automatická aktualizace*** celkového skóre týmů po každé změně.

### 3. Vizualizace výsledků
   - 📊 ***Žebříček týmů*** na základě aktuálních výsledků zobrazené v tabulce.
   > Možná: 📈 ***Grafické zobrazení*** bodů pomocí grafů a progress barů.

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

## 🚀 Instalace a spuštění

1. Naklonujte tento repozitář:
    ```bash
    git clone https://github.com/Milisaurus/ITU-projekt.git
    ```
