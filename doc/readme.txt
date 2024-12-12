Organizátor táborových bodů

Adresářová struktura:

./Backend
    - server.py - Hlavní serverová logika backendu.
    - ./data - Obsahuje všechny vytvořené tábory v JSON formátu.
        - camp_ITU-demo.json

./Frontend
    - eslint.config.js - Konfigurace ESLint pro statickou analýzu kódu.
    - index.html - Základní HTML šablona projektu.
    - package-lock.json - Automaticky generovaný zámek závislostí NPM.
    - package.json - Definice závislostí a skriptů frontendového projektu.
    - vite.config.js - Konfigurace balíčku Vite.
    
    - ./public - Obsahuje použité ikony.
    - ./src
        - api.jsx - API metody pro komunikaci mezi frontendem a backendem.
        - App.jsx - Hlavní komponenta aplikace.
        - main.jsx - Vstupní bod frontendového kódu.
        - ./components - Komponenty používané napříč aplikací.
            - ./ActivityHistory - Komponenta pro historii aktivit. (autor: xvrbas01)
                - ActivityHistory.jsx
            - ./Header - Komponenta pro záhlaví aplikace. (autor: xvrbas01)
                - Header.css
                - Header.jsx
            - ./Heading - Komponenta pro stylované nadpisy. (autor: xvrbas01)
                - Heading.css
                - Heading.jsx
            - ./NavbarButtons - Komponenta tlačítek v navigační liště. (autor: xjurac07)
                - NavbarButtons.css
                - NavbarButtons.jsx
            - ./selectDay - Komponenta pro výběr dne. (autor: xjurac07)
                - selectDay.jsx
            - ./SelectTeamMembers - Komponenta pro výběr členů týmu. (autor: xjurac07)
                - SelectTeamMembers.css
                - SelectTeamMembers.jsx
            - ./TeamForm - Formulář pro vytváření týmů. (autor: xvrbas01)
                - TeamForm.css
                - TeamForm.jsx
            - ./TeamFormEdit - Formulář pro úpravu týmů. (autor: xvrbas01)
                - TeamFormEdit.css
                - TeamFormEdit.jsx
        - ./css - Stylování jednotlivých stránek aplikace.
            - CreateCamp.css  (autor: xvrbas01)
            - IndividualPointsPage.css (autor: xjurac07)
            - MainPage.css (autor: xvrbas01)
            - StartPage.css (autor: xvrbas01)
            - TeamPointsPage.css (autor: xjurac07)
        - ./pages - Jednotlivé stránky aplikace.
            - CreateCamp.jsx - Stránka pro vytvoření nového tábora. (autor: xvrbas01)
            - EditTeam.jsx - Stránka pro úpravu týmů. (autor: xvrbas01)
            - IndividualPointsPage.jsx - Stránka pro zadávání individuálních bodů. (autor: xjurac07)
            - MainPage.jsx - Hlavní stránka aplikace obsahující tabulku s body a historii aktivit. (autor: xvrbas01)
            - StartPage.jsx - Úvodní stránka aplikace. (autor: xvrbas01)
            - TeamPointsPage.jsx - Stránka pro bodování týmů. (autor: xjurac07)
