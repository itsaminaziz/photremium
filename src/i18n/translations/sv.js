/* Svenska — Swedish */
const sv = {
  nav: {
    home: 'Hem',
    imageConverter: 'Bildkonverterare',
    imageCompressor: 'Bildkompressor',
    otherTools: 'Fler Verktyg',
    resizeImage: 'Ändra Bildstorlek',
    cropImage: 'Beskär Bild',
    photoEditor: 'Fotoredigerare',
    removeBackground: 'Ta Bort Bakgrund',
    watermarkImage: 'Vattenstämpel',
    qrCodeGenerator: 'QR-kodsgenerator',
    qrCodeScanner: 'QR-kodsläsare',
    aboutUs: 'Om Oss',
    faceBlur: 'Ansiktsoskärpa',
  },

  hero: {
    heading: 'Alla Bildverktyg Du Behöver',
    subheading: 'Gratis onlineverktyg för att konvertera, komprimera, ändra storlek, beskära och redigera bilder. All bearbetning sker i webbläsaren — snabbt och säkert.',
  },

  tools: {
    compressImage: { title: 'Komprimera Bild', desc: 'Komprimera JPG, PNG, SVG och GIF med bibehållen kvalitet.' },
    resizeImage: { title: 'Ändra Bildstorlek', desc: 'Ändra storlek i procent eller pixlar.' },
    cropImage: { title: 'Beskär Bild', desc: 'Beskär enkelt JPG, PNG och GIF.' },
    convertToJpg: { title: 'Konvertera till JPG', desc: 'Batchkonvertera PNG, GIF, TIF, SVG, WEBP och andra format till JPG.' },
    convertFromJpg: { title: 'Konvertera från JPG', desc: 'Konvertera JPG-bilder till PNG och GIF.' },
    qrCodeGenerator: { title: 'QR-kodsgenerator', desc: 'Skapa anpassade QR-koder för URL, text, WiFi, kontakter med mera.' },
    qrCodeScanner: { title: 'QR-kodsläsare', desc: 'Skanna QR-koder direkt med kamera eller ladda upp bild.' },
    blurFace: { title: 'Ansiktsoskärpa', desc: 'Identifiera och sudda automatiskt ut ansikten i bilder för integritetsskydd.' },
    removeBackground: { title: 'Ta Bort Bakgrund', desc: 'Ta snabbt bort bildbakgrunder med hög precision.' },
    watermarkImage: { title: 'Vattenstämpel', desc: 'Lägg till vattenstämplar på bilder på några sekunder.' },
  },

  whyChoose: {
    label: 'Varför Oss',
    heading: 'Ett Smartare Sätt att Redigera Bilder',
    subheading: 'Betrodd av tusentals kreatörer, designers och utvecklare världen över.',
    reasons: {
      fast: { title: 'Blixtsnabb', desc: 'All bearbetning sker direkt i din webbläsare. Inga uppladdningar till externa servrar.' },
      private: { title: '100% Säkert och Privat', desc: 'Dina filer lämnar aldrig din enhet. Vi lagrar inte dina bilder.' },
      noLimits: { title: 'Inga Begränsningar, Ingen Registrering', desc: 'Använd alla verktyg hur mycket du vill — helt gratis.' },
      quality: { title: 'Professionell Kvalitet', desc: 'Våra algoritmer levererar professionella resultat.' },
      batch: { title: 'Batchbearbetning', desc: 'Bearbeta flera filer på en gång.' },
      everywhere: { title: 'Fungerar Överallt', desc: 'Fungerar perfekt på dator, surfplatta och telefon.' },
    },
    stats: {
      imagesProcessed: 'Bearbetade Bilder',
      countriesServed: 'Betjänade Länder',
      uptime: 'Drifttid',
      freeTools: 'Gratis Verktyg',
    },
  },

  footer: {
    tagline: 'Gratis onlinebildverktyg — konvertera, komprimera, ändra storlek, beskär och redigera bilder på sekunder.',
    imageTools: 'Bildverktyg',
    moreTools: 'Fler Verktyg',
    company: 'Företag',
    contact: 'Kontakt',
    allRightsReserved: 'Alla rättigheter förbehållna.',
    privacyPolicy: 'Integritetspolicy',
    termsOfService: 'Användarvillkor',
  },

  faq: {
    badge: 'Vanliga Frågor',
    heading: 'Vanliga Frågor',
    subheading: 'Snabba svar på vanliga frågor om dessa verktyg.',
    stillHaveQuestions: 'Har du fler frågor? Vi hjälper gärna!',
    reachOut: 'Kontakta Oss',
    questionHeader: 'Fråga',
  },

  contactForm: {
    badge: 'Kontakta oss',
    title: 'Kontakta oss',
    subtitle: 'Vi hör gärna från dig. Skicka ett meddelande!',
    nameLabel: 'Namn',
    namePlaceholder: 'Ditt fullständiga namn',
    emailLabel: 'E-post',
    emailPlaceholder: 'du@email.se',
    subjectLabel: 'Ämne',
    subjectPlaceholder: 'Vad handlar det om?',
    messageLabel: 'Meddelande',
    messagePlaceholder: 'Skriv ditt meddelande här…',
    errName: 'Namn krävs',
    errEmail: 'E-post krävs',
    errEmailInvalid: 'Ange en giltig e-postadress',
    errSubject: 'Ämne krävs',
    errMessage: 'Meddelande krävs',
    sending: 'Skickar…',
    send: 'Skicka Meddelande',
    successTitle: 'Meddelande Skickat!',
    successMsg: 'Tack för att du hörde av dig. Vi återkommer snart.',
    sendAnother: 'Skicka ett till',
    sendError: 'Något gick fel. Försök igen.',
  },

  about: {
    label: 'Om Oss',
    heading: 'Skapad för Kreatörer, av Kreatörer',
    subheading: 'Vi anser att kraftfulla bildverktyg bör vara gratis, snabba och tillgängliga för alla.',
    missionTitle: 'Vårt Uppdrag',
    missionText: 'photremium.com skapades med ett enkelt mål: att ge den mest intuitiva, snabbaste och mest integritetsvänliga bildupplevelsen på webben.',
    privacyTitle: 'Integritet Först',
    privacyText: 'Vi laddar inte upp, lagrar eller bearbetar dina bilder på distans. Allt stannar på din enhet.',
    techTitle: 'Modern Teknik',
    techText: 'Byggd med den senaste webbteknologin, inklusive WebAssembly, Canvas API och modern React.',
    communityTitle: 'Gemenskapsorienterad',
    communityText: 'Varje funktion är inspirerad av feedback från riktiga användare.',
    globalTitle: 'Global Räckvidd',
    globalText: 'Används av kreatörer från över 120 länder.',
  },

  seo: {
    homeTitle: 'photremium.com — Gratis Online Bildkonverterare, Kompressor och Redigerare',
    homeDesc: 'Konvertera, komprimera, ändra storlek, beskär och redigera bilder gratis online.',
    homeKeywords: 'bildkonverterare, bildkompressor, ändra bildstorlek, beskär bild, fotoredigerare',
    aboutTitle: 'Om photremium.com — Vårt Uppdrag',
    aboutDesc: 'Lär dig om photremium.com, det gratis online-bildverktyget som miljoner litar på.',
    aboutKeywords: 'om photremium.com, bildverktyg, gratis bildredigerare',
  },

      privacyPolicyPage: {
    seo: {
      title: 'Sekretesspolicy — Photremium | Inga serveruppladdningar, noll datalagring',
      description: 'Photremiums sekretesspolicy förklarar hur vi skyddar din integritet. All bildbehandling sker till 100 % i din webbläsare – inga filuppladdningar till någon server, inga personliga data samlas in, ingen spårning.',
      ogTitle: 'Sekretesspolicy — Photremium | Inga uppladdningar, noll lagringsutrymme',
      ogDescription: 'Dina filer stannar på din enhet. Photremium bearbetar alla bilder lokalt i din webbläsare utan serverkontakt, ingen data lagrad och ingen spårning.',
      twitterTitle: 'Sekretesspolicy – ​​Photremium',
      twitterDescription: '100 % webbläsarbaserade bildverktyg. Inga uppladdningar, ingen lagring, ingen spårning. Läs vår fullständiga integritetspolicy.',
      schemaName: 'Sekretesspolicy - Photremium',
      schemaDescription: 'Photremiums sekretesspolicy - inga serveruppladdningar, ingen data lagrad, 100 % bildbehandling i webbläsaren.'
    },
    hero: {
      badge: 'Sekretesspolicy',
      titlePrefix: 'Din integritet är vår',
      titleHighlight: 'Högsta prioritet',
      subPrefix: 'photremium.com bygger på en enkel princip —',
      subStrong: 'dina filer lämnar aldrig din enhet',
      subSuffix: 'Varje bildverktyg på den här webbplatsen körs helt i din webbläsare. Inga uppladdningar. Inget moln. Ingen kompromiss.',
      effectiveLabel: 'Effektiv',
      lastUpdatedLabel: 'Senast uppdaterad',
      worldwideLabel: 'Gäller över hela världen'
    },
    trustCards: [
      {
        title: 'Inga serveruppladdningar',
        desc: 'Dina filer lämnar aldrig din enhet. All bearbetning sker till 100 % i webbläsaren.'
      },
      {
        title: 'Noll datalagring',
        desc: 'Vi lagrar ingenting om dig, dina bilder eller din aktivitet.'
      },
      {
        title: 'Ingen spårning',
        desc: 'Ingen beteendespårning, inga fingeravtryck, ingen profilering.'
      },
      {
        title: 'GDPR-vänlig',
        desc: 'Designad från grunden för att respektera globala integritetsbestämmelser.'
      }
    ],
    contentsTitle: 'Innehåll',
    toc: {
      overview: 'Översikt',
      'no-upload': 'Ingen serverbearbetning',
      'data-collect': 'Data vi samlar in',
      cookies: 'Cookies och lagring',
      'third-party': 'Tredjepartstjänster',
      analytics: 'Analytics',
      children: 'Barns integritet',
      rights: 'Dina rättigheter',
      security: 'Säkerhet',
      changes: 'Policyändringar',
      contact: 'Kontakta oss'
    },
    sections: {
      overview: {
        title: '1. Översikt',
        subtitle: 'Vad denna policy omfattar',
        p1Prefix: 'Denna integritetspolicy beskriver hur',
        p1Middle: '("vi", "oss" eller "vår") hanterar - eller mer exakt,',
        p1Italic: 'hanterar inte',
        p1Suffix: 'din personliga information när du använder våra kostnadsfria bildverktyg online på',
        p2: 'Till skillnad från traditionella webbapplikationer som skickar filer till fjärrservrar för bearbetning, använder photremium.com moderna webbläsar-API:er (Canvas API, WebAssembly, WebWorkers) för att utföra varje operation lokalt på din enhet. Resultatet: ingen dataöverföring, ingen lagring, ingen risk.',
        calloutLabel: 'Enkel engelsk sammanfattning:',
        calloutText: 'Vi kan inte se dina bilder, vi vill inte, och vår teknik är speciellt framtagen så att vi aldrig kunde.'
      },
      noUpload: {
        title: '2. Ingen serverbearbetning — någonsin',
        subtitle: 'Hur våra verktyg faktiskt fungerar',
        introPrefix: 'Varje verktyg på photremium.com - bildkonverterare, kompressor, resizer, bakgrundsborttagning, ansiktsoskärpa, vattenstämpel, beskärning och QR-kodverktyg - bearbetar dina filer',
        introStrong: '100 % i din webbläsare',
        introSuffix: 'med JavaScript och WebAssembly på klientsidan.',
        points: [
          {
            label: 'Ingen filuppladdning sker någonsin.',
            text: 'När du väljer en fil läses den av din webbläsares File API och bearbetas i minnet – den skickas aldrig över nätverket.'
          },
          {
            label: 'Ingen server tar emot din bild.',
            text: 'Vårt CDN serverar bara HTML-, CSS- och JavaScript-tillgångarna som behövs för att köra appen – inte dina filer.'
          },
          {
            label: 'Ingen tillfällig förvaring.',
            text: 'Bearbetade resultat finns bara i din webbläsares minne och släpps när du stänger eller navigerar bort från sidan.'
          },
          {
            label: 'Fungerar offline.',
            text: 'De flesta verktyg fortsätter att fungera utan internetanslutning efter den första sidladdningen - ytterligare ett bevis att ingen server är inblandad.'
          }
        ],
        callout: 'Du kan verifiera detta själv: öppna webbläsarens nätverksfliken i utvecklarverktyg, välj en bild och bekräfta att ingen fildata överförs till någon extern server.'
      },
      dataCollect: {
        title: '3. Data vi samlar in (och inte samlar in)',
        subtitle: 'Full insyn i datapraxis',
        headers: {
          type: 'Datatyp',
          collected: 'Samlade?',
          whereWhy: 'Var / Varför'
        },
        rows: [
          {
            type: 'Dina bilder/filer',
            badge: 'Aldrig',
            variant: 'grön',
            showX: true,
            whereWhy: 'Bearbetas helt i din webbläsare – överförs aldrig'
          },
          {
            type: 'Namn/e-postadress',
            badge: 'Aldrig',
            variant: 'grön',
            showX: true,
            whereWhy: 'Inget konto eller registrering krävs för att använda något verktyg'
          },
          {
            type: 'IP-adress',
            badge: 'Minimal',
            variant: 'grå',
            showX: false,
            whereWhy: 'Standardwebbserverloggar bevaras <= 30 dagar, inte kopplade till identitet'
          },
          {
            type: 'Webbläsare / OS-typ',
            badge: 'Minimal',
            variant: 'grå',
            showX: false,
            whereWhy: 'Skickas automatiskt av din webbläsare; används endast för kompatibilitet'
          },
          {
            type: 'Besökta sidor/klick',
            badge: 'Aggregerad',
            variant: 'blå',
            showX: false,
            whereWhy: 'Endast anonym analys (ingen personlig identifiering)'
          },
          {
            type: 'Språkinställning',
            badge: 'Endast lokalt',
            variant: 'blå',
            showX: false,
            whereWhy: 'Sparad till localStorage på din enhet – har aldrig skickats till oss'
          },
          {
            type: 'Betalning/ekonomidata',
            badge: 'Aldrig',
            variant: 'grön',
            showX: true,
            whereWhy: 'photremium.com är helt gratis och inga betalningar krävs'
          }
        ]
      },
      cookies: {
        title: '4. Cookies och lokal lagring',
        subtitle: 'Vad som lagras på din enhet',
        intro: 'photremium.com använder inga reklamcookies, inga spårningscookies över flera webbplatser och inga tredjepartscookies. Den enda webbläsarlagringen vi använder är för väsentlig webbplatsfunktionalitet.',
        points: [
          {
            label: 'Språkinställning',
            text: 'Lagras i localStorage så att sajten kommer ihåg ditt föredragna språk mellan besöken. Har aldrig skickats till våra servrar.'
          },
          {
            label: 'Tema/gränssnittsinställningar',
            text: 'Om du ställer in en visningsinställning sparas den endast lokalt på din enhet.'
          },
          {
            label: 'Inga sessionscookies.',
            text: 'photremium.com har inget inloggningssystem, så inga sessions-ID-cookies skrivs någonsin.'
          }
        ],
        callout: 'Du kan rensa all lokal lagring på photremium.com när som helst via din webbläsarinställningar (Inställningar -> Sekretess -> Rensa webbinformation -> Cachad data & cookies). Att göra det har ingen effekt på din förmåga att använda verktygen.'
      },
      thirdParty: {
        title: '5. Tredjepartstjänster',
        subtitle: 'Externa tjänster vi använder och varför',
        intro: 'photremium.com använder en minimal uppsättning betrodda tredjepartstjänster strikt för infrastruktur och prestanda. Ingen av dessa tjänster tar emot dina bilder eller någon personlig identifierbar information.',
        headers: {
          service: 'Service',
          purpose: 'Ändamål',
          dataShared: 'Data delad',
          privacyPolicy: 'Sekretesspolicy'
        },
        rows: [
          {
            service: 'Cloudflare-sidor',
            purpose: 'Hosting & CDN-leverans av webbplatstillgångar',
            dataShared: 'IP-adress, HTTP-rubriker (standard)',
            privacyLink: 'https://www.cloudflare.com/privacypolicy/',
            privacyText: 'cloudflare.com/privacypolicy'
          },
          {
            service: 'Typsnitt fantastiskt',
            purpose: 'Ikonteckensnitt laddade från CDN',
            dataShared: 'IP-adress (endast CSS-begäran)',
            privacyLink: 'https://fontawesome.com/privacy',
            privacyText: 'fontawesome.com/privacy'
          },
          {
            service: 'Google Fonts',
            purpose: 'Typsnittsladdning (om tillämpligt)',
            dataShared: 'IP-adress (endast teckensnittsbegäran)',
            privacyLink: 'https://policies.google.com/privacy',
            privacyText: 'policies.google.com'
          }
        ],
        outro: 'Vi delar inte dina uppgifter med annonsörer, datamäklare eller någon annan tredje part utöver de infrastrukturleverantörer som anges ovan.'
      },
      analytics: {
        title: '6. Analys',
        subtitle: 'Aggregerad, integritetsrespekterande användningsdata',
        introPrefix: 'För att förstå vilka verktyg som är populära och hur man kan förbättra webbplatsen kan vi samla in',
        introStrong: 'aggregerad, anonymiserad',
        introSuffix: 'användningsstatistik som:',
        points: [
          'Antal sidvisningar per verktyg (ingen användaridentifiering)',
          'Hänvisningskälla (t.ex. Google-sökning, direktlänk) – inga personliga uppgifter',
          'Geografisk data på landsnivå (inte stad eller exakt plats)',
          'Webbläsare/enhetstyp för kompatibilitetsanalys'
        ],
        calloutLabel: 'Ingen data är kopplad till dig personligen.',
        calloutText: 'Vi använder inte Google Analytics eller Meta Pixel. All analys som vi använder är verktyg som tar integritet först (t.ex. Plausible eller liknande).'
      },
      children: {
        title: '7. Barns integritet',
        subtitle: 'COPPA & barnsäkerhetsöverensstämmelse',
        p1: 'photremium.com samlar inte medvetet in någon personlig information från barn under 13 år (eller 16 i Europeiska unionen enligt GDPR). Eftersom vi inte samlar in personlig information från någon användare finns det inget speciellt att göra för yngre användare – sidan är lika säker för alla.',
        p2Prefix: 'Om du tror att ett barn på något sätt har lämnat in personlig information via vårt kontaktformulär, vänligen kontakta oss omedelbart på',
        p2Suffix: 'och vi kommer omedelbart att ta bort det.'
      },
      rights: {
        title: '8. Dina rättigheter',
        subtitle: 'GDPR, CCPA och globala integritetsrättigheter',
        intro: 'Eftersom photremium.com inte samlar in någon personligt identifierbar information, gäller de flesta datasubjekträttigheter trivialt – det finns ingen data om dig att komma åt, korrigera eller radera. Ändå erkänner och respekterar vi till fullo följande rättigheter:',
        points: [
          {
            label: 'Rätt till tillträde',
            text: 'Du kan begära en kopia av alla uppgifter vi har om dig. (Det finns inga utöver anonymiserade loggar.)'
          },
          {
            label: 'Rätt till rättelse',
            text: 'Du kan begära rättelse av felaktiga personuppgifter.'
          },
          {
            label: 'Rätt till radering ("Rätt att bli glömd")',
            text: 'Du kan begära radering av alla personuppgifter vi har (GDPR Art. 17, CCPA).'
          },
          {
            label: 'Rätt att invända / välja bort',
            text: 'Du kan välja bort alla framtida analyssamlingar genom att använda ett borttagnings- eller annonsblockeringsverktyg på webbläsarnivå.'
          },
          {
            label: 'Rätt till dataportabilitet',
            text: 'Allt ditt arbete laddas ner direkt till din enhet – ingen exportförfrågan behövs.'
          }
        ],
        callout: 'Dessa rättigheter gäller för alla användare över hela världen oavsett jurisdiktion – vi tillämpar den högsta standarden (GDPR) som vår baslinje.'
      },
      security: {
        title: '9. Säkerhet',
        subtitle: 'Hur vi skyddar din upplevelse',
        intro: 'Den säkraste datan är data som aldrig samlas in. photremium.com klientsida-arkitektur innebär att ett serverintrång inte kan exponera dina filer eftersom dina filer aldrig finns på våra servrar. Ytterligare säkerhetsåtgärder inkluderar:',
        points: [
          {
            label: 'HTTPS-tillämpning',
            text: 'All trafik mellan din webbläsare och vårt CDN är krypterad via TLS 1.2+ med HSTS.'
          },
          {
            label: 'Content Security Policy (CSP)',
            text: 'Strikta rubriker förhindrar cross-site scripting och inline scriptinjection.'
          },
          {
            label: 'Regelbundna beroenderevisioner',
            text: 'Vi granskar och uppdaterar npm-paket regelbundet för att korrigera kända sårbarheter.'
          }
        ],
        disclosurePrefix: 'Ansvarsfullt avslöjande',
        disclosureTextPrefix: 'Hittade du ett säkerhetsproblem? Maila oss på',
        disclosureTextSuffix: 'och vi kommer att svara inom 48 timmar.'
      },
      changes: {
        title: '10. Ändringar av denna policy',
        subtitle: 'Hur vi hanterar policyuppdateringar',
        intro: 'Vi kan uppdatera denna integritetspolicy då och då för att återspegla förändringar i vår praxis, verktyg eller juridiska krav. När vi gör:',
        points: [
          {
            label: '"Senast uppdaterad"',
            text: 'datumet högst upp på denna sida kommer att revideras.'
          },
          {
            label: 'Materialförändringar',
            text: 'kommer att meddelas via ett framträdande meddelande på hemsidan i minst 30 dagar.'
          },
          {
            label: 'Tidigare versioner',
            text: 'av denna policy kommer att arkiveras och tillgänglig på begäran.'
          }
        ],
        outro: 'Fortsatt användning av photremium.com efter att ändringar har publicerats utgör ett godkännande av den uppdaterade policyn. Vi uppmuntrar dig att granska den här sidan med jämna mellanrum.'
      },
      contact: {
        title: '11. Kontakt & dataförfrågningar',
        subtitle: 'Hör av dig angående integritet',
        p1Prefix: 'För alla frågor, funderingar eller formella dataförfrågningar relaterade till denna sekretesspolicy, vänligen kontakta oss. Vi strävar efter att svara på alla integritetsrelaterade förfrågningar inom',
        p1Strong: '5 arbetsdagar'
      }
    },
    footer: {
      privacyQuestionsTitle: 'Sekretessfrågor?',
      privacyQuestionsDesc: 'Skicka oss dina integritetsfrågor, dataförfrågningar eller funderingar så svarar vi omgående.',
      versionHistoryTitle: 'Versionshistorik',
      v2Label: 'v2.0 — Major rewrite',
      v11Label: 'v1.1 — Added CCPA rights',
      v10Label: 'v1.0 — Initial policy'
    }
  },
common: {
    new: 'Nytt!',
    download: 'Ladda ner',
    downloadAll: 'Ladda ner Alla',
    downloadAs: 'Ladda ner som:',
    zip: 'ZIP',
    separate: 'Separat',
    upload: 'Ladda upp',
    dragDrop: 'Dra och släpp bilder här eller klicka för att bläddra',
    remove: 'Ta bort',
    reset: 'Återställ',
    apply: 'Tillämpa',
    cancel: 'Avbryt',
    clear: 'Rensa',
    close: 'Stäng',
    save: 'Spara',
    processing: 'Bearbetar...',
    noFiles: 'Ingen fil vald',
    selectFiles: 'Välj Filer',
    or: 'eller',
    browseFiles: 'Bläddra filer',
    dropHere: 'Släpp bilder här',
    chooseFiles: 'Välj Filer',
    pasteHint: 'Du kan också klistra in en bild',
    quality: 'Kvalitet',
    width: 'Bredd',
    height: 'Höjd',
    format: 'Format',
    compression: 'Komprimering',
    preview: 'Förhandsgranskning',
    original: 'Original',
    result: 'Resultat',
    before: 'Före',
    after: 'Efter',
    startOver: 'Börja Om',
    startOverConfirm: 'Ta bort alla bilder och börja om?',
    addMoreImages: 'Lägg till Fler Bilder',
    addImage: 'Lägg till Bild',
    images: 'bilder',
    totalSize: 'Total Storlek',
    size: 'Storlek',
    type: 'Typ',
    unsavedEdits: 'Du har osparade ändringar. Lämna den här sidan?',
    compareSlider: 'Jämförelsereglage',
    toggleToolsPanel: 'Växla Verktygspanel',
    closePanel: 'Stäng Panel',
    zoomIn: 'Zooma in',
    zoomOut: 'Zooma ut',
    fit: 'Anpassa',
    none: 'Ingen',
  },

  compressor: {
    seo: {
      uploadTitle: 'Bildkompressor — Komprimera JPG, PNG, SVG, GIF Gratis | photremium.com',
      uploadDesc: 'Komprimera JPG, PNG, SVG och GIF gratis online. Minska filstorleken med upp till 80% med bibehållen kvalitet.',
      uploadKeywords: 'bildkompressor, komprimera jpg, komprimera png, minska bildstorlek',
      workspaceTitle: 'Komprimerar Bilder — photremium.com Bildkompressor',
      workspaceDesc: 'Justera komprimeringsnivå och ladda ner optimerade bilder.',
      workspaceKeywords: 'komprimera bilder, optimera bilder',
    },
    title: 'Bildkompressor',
    desc: 'Komprimera JPG, PNG och GIF bilder med upp till 80%. Snabbt och säkert.',
    toCompress: 'att komprimera',
    compressionForAll: 'Komprimering för alla bilder',
    summary: 'Sammanfattning',
    originalSize: 'Originalstorlek',
    compressed: 'Komprimerad',
    saved: 'Sparat',
    compressionLabel: 'Komprimering:',
    compressing: 'Komprimerar…',
    compressDownload: 'Komprimera och Ladda ner',
    lowQualityWarning: 'Hög komprimering kan märkbart minska bildens skärpa.',
    blog: {
      tocTitle: 'Innehåll',
      title: 'Blogg om bildkomprimering',
      formatsIntro: 'Vårt verktyg stöder alla bildformat, så du kan komprimera vilken bild som helst smidigt. En fullständig lista över format finns nedan:',
      sections: [
        {
          id: 'imgcomp-card-1',
          title: '1. Vad är en bildkomprimerare?',
          paragraphs: [
            'En bildkomprimerare är ett verktyg eller en onlinetjänst som minskar filstorleken på en bild samtidigt som den visuella kvaliteten bevaras. För hög komprimering kan dock ge tydlig kvalitetsförlust.',
          ],
          listTitle: 'TYPER:',
          bullets: [
            'Förstörande komprimering: minskar storleken genom att ta bort viss bilddata. Kvaliteten kan minska, men skillnaden är ofta svår att se med blotta ögat vid måttlig nivå.',
            'Oförstörande komprimering: minskar filstorleken utan att påverka bildens visuella kvalitet.',
          ],
        },
        {
          id: 'imgcomp-card-2',
          title: '2. Varför välja vårt verktyg?',
          bullets: [
            'Vårt AI-drivna bildkomprimeringsverktyg fungerar smidigt på alla enheter och ger bästa möjliga resultat.',
            'Du kan komprimera flera bilder samtidigt (även 100+) med ett enda klick.',
            'Du behöver inte ladda upp bilder till våra servrar. Allt behandlas lokalt i din webbläsare.',
            'Vårt verktyg är helt gratis för alltid och du kan dela det med dina vänner.',
            'Du kan välja komprimeringsnivå efter dina egna behov.',
          ],
        },
        {
          id: 'imgcomp-card-3',
          title: '3. Steg-för-steg-guide',
          steps: [
            {
              heading: '1. Välj bilden/bilderna du vill komprimera.',
              bullets: [
                'Dra och släpp bilden/bilderna i uppladdningsrutan.',
                'Du kan också kopiera bilden/bilderna och klistra in i rutan med (Ctrl + V).',
                'Filutforskaren stöds också via välj-knappen.',
              ],
            },
            {
              heading: '2. Välj sedan komprimeringsprocent.',
              bullets: [
                'Ett horisontellt reglage gör det enkelt att välja komprimeringsnivå. Följ intervallen nedan för bästa resultat.',
              ],
              table: {
                headers: ['Komprimeringsprocent', 'Resultat'],
                rows: [
                  ['1%  till  40%', 'Bästa kvalitet'],
                  ['41%  till  60%', 'Normal kvalitet (Rekommenderad)'],
                  ['61%  till  100%', 'Låg kvalitet'],
                ],
              },
            },
            {
              heading: '3. Kontrollera hur mycket utrymme du sparat.',
              paragraphs: [
                'Alla storleksmätvärden visas i realtid. Du ser tydligt hur mycket utrymme du sparat och kan justera komprimeringsnivån efter önskad filstorlek.',
              ],
            },
            {
              heading: '4. Välj nedladdningsalternativ via växlingsknappen.',
              bullets: [
                'ZIP: om du komprimerar flera bilder visas detta alternativ. Det samlar alla komprimerade bilder i en ZIP-fil (rekommenderas för många bilder).',
                'Separat: laddar ner alla bilder separat i stället för som en ZIP-fil (rekommenderas för färre bilder, under 10).',
              ],
            },
            {
              heading: '5. Komprimera och ladda ner bilden.',
              paragraphs: [
                'Den här knappen laddar automatiskt ner alla komprimerade bilder enligt ditt valda nedladdningsalternativ.',
              ],
            },
          ],
        },
        {
          id: 'imgcomp-card-4',
          title: '4. Fördelar med bildkomprimering.',
          bullets: [
            'Minskade lagringskostnader: komprimerade bilder tar mindre plats.',
            'Snabbare laddning: komprimerade bilder laddas snabbare och förbättrar användarupplevelsen.',
            'Lösning för Gmail-gränsen: eftersom Gmail begränsar bilagor till 25MB hjälper komprimering dig att skicka fler filer.',
            'Snabbare delning och överföring: stora filer tar längre tid att skicka; komprimering sparar tid och data.',
            'Optimerade presentationer: okomprimerade bilder gör filer tunga, medan komprimerade bilder minskar storleken avsevärt.',
          ],
        },
        {
          id: 'imgcomp-card-5',
          title: '5. Format som stöds.',
          formats: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif', '.heic', '.heif', '.jxl', '.bmp', '.ico', '.tiff', '.tif', '.jfif', '.jpe', '.pjpeg', '.pjp', '.apng', '.svgz', '.xbm'],
        },
      ],
    },
  },

  converter: {
    seo: {
      uploadTitle: 'Bildkonverterare — Konvertera PNG, JPG, WEBP, GIF, SVG Gratis | photremium.com',
      uploadDesc: 'Konvertera bilder mellan JPG, PNG, WEBP, GIF, SVG, TIFF och BMP. Gratis online bildformatkonverterare.',
      uploadKeywords: 'bildkonverterare, png till jpg, jpg till png, webp konverterare',
      workspaceKeywords: 'konvertera bilder, bildformatkonverterare',

      routeKeywords: {

        'png-to-jpg': 'png att konvertera jpg, png to jpg, bildkonverterare, png till jpg, jpg till png, webp konverterare',

        'jpg-to-png': 'jpg att konvertera png, jpg to png, bildkonverterare, png till jpg, jpg till png, webp konverterare',

        'png-to-webp': 'png att konvertera webp, png to webp, bildkonverterare, png till jpg, jpg till png, webp konverterare',

        'jpg-to-webp': 'jpg att konvertera webp, jpg to webp, bildkonverterare, png till jpg, jpg till png, webp konverterare',

        'webp-to-jpg': 'webp att konvertera jpg, webp to jpg, bildkonverterare, png till jpg, jpg till png, webp konverterare',

        'webp-to-png': 'webp att konvertera png, webp to png, bildkonverterare, png till jpg, jpg till png, webp konverterare',

        'gif-to-jpg': 'gif att konvertera jpg, gif to jpg, bildkonverterare, png till jpg, jpg till png, webp konverterare',

        'gif-to-png': 'gif att konvertera png, gif to png, bildkonverterare, png till jpg, jpg till png, webp konverterare',

        'bmp-to-jpg': 'bmp att konvertera jpg, bmp to jpg, bildkonverterare, png till jpg, jpg till png, webp konverterare',

        'bmp-to-png': 'bmp att konvertera png, bmp to png, bildkonverterare, png till jpg, jpg till png, webp konverterare',

        'svg-to-png': 'svg att konvertera png, svg to png, bildkonverterare, png till jpg, jpg till png, webp konverterare',

        'svg-to-jpg': 'svg att konvertera jpg, svg to jpg, bildkonverterare, png till jpg, jpg till png, webp konverterare',

        'tiff-to-jpg': 'tiff att konvertera jpg, tiff to jpg, bildkonverterare, png till jpg, jpg till png, webp konverterare',

        'tiff-to-png': 'tiff att konvertera png, tiff to png, bildkonverterare, png till jpg, jpg till png, webp konverterare',

        'jpg-to-gif': 'jpg att konvertera gif, jpg to gif, bildkonverterare, png till jpg, jpg till png, webp konverterare',

        'png-to-gif': 'png att konvertera gif, png to gif, bildkonverterare, png till jpg, jpg till png, webp konverterare',

        'jpg-to-bmp': 'jpg att konvertera bmp, jpg to bmp, bildkonverterare, png till jpg, jpg till png, webp konverterare',

        'png-to-bmp': 'png att konvertera bmp, png to bmp, bildkonverterare, png till jpg, jpg till png, webp konverterare',

        'webp-to-gif': 'webp att konvertera gif, webp to gif, bildkonverterare, png till jpg, jpg till png, webp konverterare',

        'jpg-to-ico': 'jpg att konvertera ico, jpg to ico, bildkonverterare, png till jpg, jpg till png, webp konverterare',

        'png-to-ico': 'png att konvertera ico, png to ico, bildkonverterare, png till jpg, jpg till png, webp konverterare',

        'jpg-to-svg': 'jpg att konvertera svg, jpg to svg, bildkonverterare, png till jpg, jpg till png, webp konverterare',

        'png-to-svg': 'png att konvertera svg, png to svg, bildkonverterare, png till jpg, jpg till png, webp konverterare',

        'webp-to-svg': 'webp att konvertera svg, webp to svg, bildkonverterare, png till jpg, jpg till png, webp konverterare',

        'gif-to-svg': 'gif att konvertera svg, gif to svg, bildkonverterare, png till jpg, jpg till png, webp konverterare',

        'bmp-to-svg': 'bmp att konvertera svg, bmp to svg, bildkonverterare, png till jpg, jpg till png, webp konverterare',

        'tiff-to-svg': 'tiff att konvertera svg, tiff to svg, bildkonverterare, png till jpg, jpg till png, webp konverterare',

      },
    },
    title: 'Bildkonverterare',
    desc: 'Konvertera bilder mellan JPG, PNG, WEBP, GIF, SVG, TIFF och BMP. Batchkonvertering av flera filer.',
    toConvert: 'att konvertera',
    convertSettings: 'Konverteringsinställningar',
    detected: 'Identifierad',
    convertTo: 'Konvertera till',
    converting: 'Konverterar…',
    convertToFormat: 'Konvertera till {format}',
    popularConversions: 'Populära Konverteringar',
    convertingTo: 'Konverterar till',
    all: 'Alla',
  },

  resizer: {
    seo: {
      uploadTitle: 'Ändra Bildstorlek — JPG, PNG Gratis | photremium.com',
      uploadDesc: 'Ändra bildstorleken i pixlar eller procent gratis online.',
      uploadKeywords: 'ändra bildstorlek, storleksändring, jpg storlek, png storlek',
      workspaceTitle: 'Ändrar Bildstorlek — photremium.com',
      workspaceDesc: 'Ändra bildstorleken gratis online.',
      workspaceKeywords: 'ändra bildstorlek, storleksändring',
    },
    title: 'Ändra Bildstorlek',
    desc: 'Ange storlek i pixlar, procent, centimeter eller tum och ändra storlek direkt.',
    toResize: 'att ändra storlek',
    resizeSettings: 'Storleksinställningar',
    resizeBy: 'Ändra storlek via:',
    byPixels: 'Pixlar',
    byPercentage: 'Procent',
    byCentimeters: 'Centimeter',
    byInches: 'Tum',
    advanced: 'Avancerat',
    lockAspect: 'Lås Bildförhållande',
    unlockAspect: 'Lås upp Bildförhållande',
    dontEnlarge: 'Förstora inte om originalet är mindre',
    resizing: 'Ändrar storlek…',
    resizeDownload: 'Ändra Storlek och Ladda ner',
    blog: {
      tocTitle: 'Innehåll',
      title: 'Blogg om bildstorleksändring',
      sections: [
        {
          id: 'imgresize-card-1',
          title: '1. Varför använda ett bildstorleksverktyg?',
          paragraphs: [
            'Ett bildstorleksverktyg är ett verktyg/program som används för att ändra bildens dimensioner. Du kan justera höjd, bredd eller båda för att få den storlek du behöver. Det är särskilt användbart för sociala medieplattformar som har storleksgränser för uppladdning/publicering av bilder.',
          ],
          listTitle: 'Till exempel:',
          bullets: [
            'Instagram-inlägg: 1080 x 1080px (kvadrat)',
            'Facebook-inlägg: 1200 x 630px',
            'X (Twitter)-inlägg: 1200 x 675px',
            'Instagram Story: 1080 x 1920px',
          ],
        },
        {
          id: 'imgresize-card-2',
          title: '2. Varför välja vårt bildstorleksverktyg?',
          paragraphs: [
            'Vårt AI-baserade bildstorleksverktyg låter dig ändra storlek med hög precision och mycket hög hastighet. Verktyget fungerar smidigt på alla enheter och kräver ingen appinstallation. Alla funktioner finns online i din webbläsare.',
          ],
          bullets: [
            'Du kan ändra storlek på flera bilder samtidigt (även 100+). På kraftfulla enheter kan även 400–500 bilder bearbetas på några sekunder.',
            'All bearbetning sker lokalt i webbläsaren. Du behöver inte ladda upp bilder till vår server, så bilderna lämnar aldrig din enhet.',
            'Flera enheter för storleksändring stöds.',
            'Du kan behålla bildförhållandet med en enkel kryssruta.',
            'När du ändrar storlek på många bilder kan du ladda ner separat eller som ZIP.',
          ],
        },
        {
          id: 'imgresize-card-3',
          title: '3. Steg-för-steg-guide',
          steps: [
            {
              heading: 'Börja med att välja den/de bilder du vill ändra storlek på. Det finns flera sätt att välja.',
              bullets: [
                'Dra och släpp bilder i uppladdningsrutan.',
                'Du kan också klistra in bilder med genvägen “Ctrl + V”.',
                'Eller klicka på “Choose Files” för att välja via filutforskaren.',
              ],
            },
            {
              heading: 'Välj därefter en enhet för storleksändring. Tillgängliga enheter är:',
              bullets: ['Pixels', 'Percentage', 'Centimeters', 'Inches'],
            },
            {
              heading: 'Efter val av enhet justerar du höjd och bredd. Du kan även låsa bildförhållandet via kryssrutan.',
            },
            {
              heading: 'Om du inte vill förstora över originalstorleken, markera “Don’t enlarge if original is smaller”.',
            },
            {
              heading: 'Välj sedan ett nedladdningsalternativ.',
              bullets: [
                'Välj ZIP om du vill ladda ner alla ändrade bilder i en enda zip-fil.',
                'Välj “separate” om du vill ladda ner varje bild separat.',
              ],
            },
            {
              heading: 'Slutligen klickar du på “Resize & Download” för att ladda ner enligt ditt val.',
            },
          ],
        },
        {
          id: 'imgresize-card-4',
          title: '4. Fördelar med bildstorleksverktyg: den största fördelen är att bilder passar korrekt på webbsidor och i sociala medier-inlägg.',
          tocLabel: '4. Fördelar med bildstorleksverktyg',
          bullets: [
            'Bättre UX: rätt storlek och placering av bilder förbättrar användarupplevelsen avsevärt.',
            'Stöd för sociala medier: många plattformar har begränsningar för bildstorlek, och verktyget hjälper dig att uppfylla dem.',
            'Responsiv design: utvecklare behöver flera bilddimensioner för olika enheter.',
            'Bättre val: istället för att sträcka eller hårt beskära en bild är storleksändring ofta det bättre alternativet.',
          ],
        },
        {
          id: 'imgresize-card-5',
          title: '5. Format som stöds: vårt bildstorleksverktyg stödjer val av bilder i alla format. Stödda format listas nedan:',
          tocLabel: '5. Format som stöds',
          formats: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif', '.heic', '.heif', '.jxl', '.bmp', '.ico', '.tiff', '.tif', '.jfif', '.jpe', '.pjpeg', '.pjp', '.apng', '.svgz', '.xbm'],
        },
      ],
    },
  },

  cropper: {
    seo: {
      uploadTitle: 'Beskär Bild — JPG, PNG, GIF Gratis | photremium.com',
      uploadDesc: 'Beskär enkelt JPG, PNG och GIF bilder gratis online.',
      uploadKeywords: 'beskär bild, beskärningsverktyg, beskär jpg, beskär png',
      workspaceTitle: 'Beskär Bild — photremium.com',
      workspaceDesc: 'Beskär bilder gratis online.',
      workspaceKeywords: 'beskär bild, beskärning',
    },
    title: 'Beskär Bild',
    desc: 'Beskär JPG, PNG, GIF och andra med en visuell redigerare. Förinställda eller fria bildförhållanden.',
    toCrop: 'att beskära',
    cropSettings: 'Beskärningsinställningar',
    widthPx: 'Bredd (px)',
    heightPx: 'Höjd (px)',
    positionX: 'Position X (px)',
    positionY: 'Position Y (px)',
    cropTemplate: 'Beskärningsmall',
    landscape: 'Liggande',
    portrait: 'Stående',
    square: 'Kvadrat',
    freeform: 'Fri form',
    cropping: 'Beskär…',
    cropDownload: 'Beskär och Ladda ner',
    cropDownloadAll: 'Beskär och Ladda ner Alla',
    saveNext: 'Spara och Nästa',
    croppedNofTotal: 'Beskuren {n} av {total}.',
    downloadN: 'Ladda ner {n}',
    blog: {
      tocTitle: 'Innehåll',
      title: 'Blogg om Bildbeskärning',
      sections: [
        {
          id: 'imgcrop-card-1',
          title: '1. Varför använda ett bildbeskärningsverktyg?',
          paragraphs: [
            'Ett bildbeskärningsverktyg är ett programverktyg som används för att beskära en bild till önskad form. Det används ofta för att behålla den del av bilden som behövs och ta bort yttre, oönskade delar för olika ändamål. Verktyget ger en beskärningsruta som du kan justera där du vill beskära.',
          ],
          listTitle: 'Till exempel:',
          bullets: [
            'Beskära ut dig själv från ett gruppfoto.',
            'Beskära ut ditt namn från en lista.',
            'Beskära ut en förloppsindikator från en helskärmsbild.',
          ],
        },
        {
          id: 'imgcrop-card-2',
          title: '2. Varför välja vårt bildbeskärningsverktyg?',
          paragraphs: [
            'Vårt bildbeskärningsverktyg låter dig beskära bilder exakt och mycket snabbt. Du behöver bara justera beskärningsrutans storlek till den position du vill beskära på vilken bild som helst. Nästan alla bildformat stöds vid bildval.',
          ],
          bullets: [
            'Du kan beskära så många bilder som din enhet klarar. Har du en högpresterande enhet kan du till och med beskära 100+ bilder samtidigt utan lagg eller andra problem.',
            'Dina bilder bearbetas i din lokala webbläsare. Du behöver inte ladda upp några bilder till vår server, så inga bilder lämnar din enhet. Du kan beskära privata bilder utan säkerhetsrisker.',
            'Många verktyg visar fel om ogiltigt bildformat. Vårt verktyg löser detta genom att stödja nästan alla bildformat.',
            'Om du beskär många bilder samtidigt kan du med vårt verktyg ladda ner de beskurna bilderna som ZIP eller som separata filer enligt din preferens.',
          ],
        },
        {
          id: 'imgcrop-card-3',
          title: '3. Steg-för-steg-guide',
          steps: [
            {
              heading: '1. Välj först bilden du vill beskära. Vårt verktyg stöder även val av flera bilder samtidigt.',
              bullets: [
                'Dra och släpp bilder i släppzonen för att beskära dem.',
                'Du kan också välja bilder via filutforskaren genom att klicka på knappen choose files i beskärningsrutan.',
                'Kortkommandot Ctrl + V stöds också för att klistra in bilder i släppzonen.',
              ],
            },
            {
              heading: '2. Justera sedan storlek och position för beskärningsrutan på bilden.',
            },
            {
              heading: '3. Du kan även justera beskärningsrutan manuellt genom att ange höjd, bredd, horisontell position och vertikal position.',
            },
            {
              heading: '4. Du kan också använda några färdiga mallar:',
              bullets: [
                'Landscape(16:9)',
                'Portrait(9:16)',
                'Square(1:1)',
              ],
            },
            {
              heading: '5. Därefter väljer du ett av nedladdningsalternativen.',
              bullets: [
                'ZIP: Välj detta om du beskär många bilder och vill ladda ner alla beskurna bilder som en fil.',
                'Separate: Om du vill ladda ner alla beskurna bilder separat väljer du detta i växlingsknappen.',
              ],
            },
            {
              heading: '6. Klicka sedan på knappen Crop & Download för att ladda ner alla dina beskurna bilder enligt dina förinställda mått.',
            },
          ],
        },
        {
          id: 'imgcrop-card-4',
          title: '4. Fördelar med bildbeskärning: ett bildbeskärningsverktyg ger flera fördelar i den digitala världen. Några beskrivs nedan:',
          tocLabel: '4. Fördelar med bildbeskärning',
          bullets: [
            'Anpassa bilder i ramar: bildbeskärning hjälper dig att placera bilden korrekt i en ram. Den ramen kan finnas på en webbsida eller i sociala medier.',
            'Förbättra UX: eftersom korrekt bildplacering förbättrar användarupplevelsen hjälper bildbeskärning starkt till att förbättra UX.',
            'Ta bort oönskade kanter: du kan ta bort oönskade kanter från bilden för att förfina den.',
            'Isolera önskat objekt: du kan också isolera dig själv från ett gruppfoto.',
            'Spara lagringsutrymme: beskärning sparar lagring eftersom den råa bildytan tas bort och bara den nödvändiga delen sparas.',
            'Optimera presentationer: om en vanlig presentation med 10 obeskurna bilder tar cirka 30MB, kan samma presentation med beskurna bilder ta cirka 10MB.',
          ],
        },
        {
          id: 'imgcrop-card-5',
          title: '5. Stödda format:',
          formats: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif', '.heic', '.heif', '.jxl', '.bmp', '.ico', '.tiff', '.tif', '.jfif', '.jpe', '.pjpeg', '.pjp', '.apng', '.svgz', '.xbm'],
        },
      ],
    },
  },

  photoEditor: {
    seo: {
      title: 'Online Fotoredigerare — Gratis Redigering med Text, Effekter, Ramar | photremium.com',
      desc: 'Redigera foton online gratis — lägg till text, effekter, ramar, klistermärken. Fungerar i webbläsaren.',
      keywords: 'fotoredigerare, online fotoredigerare, redigera foton online gratis',
    },
    title: 'Fotoredigerare',
    desc: 'Förbättra dina foton med text, effekter, ramar och klistermärken.',
    toEdit: 'att redigera',
    textTypography: 'Text och Typografi',
    textTypographyDesc: 'Lägg till text med olika teckensnitt, färger, skuggor och positionsalternativ.',
    filtersEffects: 'Filter och Effekter',
    filtersEffectsDesc: 'Tillämpa professionella filter och justera ljusstyrka, kontrast och mättnad.',
    framesStickers: 'Ramar och Klistermärken',
    framesStickersDesc: 'Välj vackra ramar och roliga klistermärken för att förbättra dina bilder.',
  },

  removeBg: {
    seo: {
      uploadTitle: 'Gratis Ta Bort Bildbakgrund | photremium.com',
      uploadDesc: 'Ta snabbt bort bildbakgrunder med hög precision. Gratis onlineverktyg.',
      uploadKeywords: 'ta bort bakgrund, bakgrundsborttagning, transparent bakgrund',
      workspaceTitle: 'Ta Bort Bakgrund — photremium.com',
      workspaceDesc: 'Ta bort bildbakgrund gratis online.',
      workspaceKeywords: 'ta bort bakgrund, transparent bakgrund',
    },
    title: 'Ta Bort Bakgrund',
    desc: 'Ta omedelbart bort bildbakgrunder med avancerad kantidentifiering. 100% gratis, fungerar i webbläsaren.',
    toRemoveBg: 'att ta bort bakgrunden',
    backgroundRemover: 'Bakgrundsborttagningsverktyg',
    processingProgress: 'Bearbetningsförlopp',
    processingNImages: 'Bearbetar {n} bilder…',
    allNProcessed: 'Alla {n} bilder bearbetade!',
    nOfTotalDone: '{n} / {total} klart',
    fileName: 'Filnamn',
    dimensions: 'Dimensioner',
    status: 'Status',
    statusDone: '✓ Klart',
    statusProcessing: '⏳ Bearbetar',
    statusError: '✗ Fel',
    statusPending: '⏸ Väntar',
    badgeDone: 'Klart',
    badgeProcessing: 'Bearbetar…',
    badgeError: 'Fel',
    removingBg: 'Tar bort bakgrund…',
    retry: 'Försök igen',
    downloading: 'Laddar ner…',
    nextImage: 'Nästa Bild',
  },

  watermark: {
    seo: {
      uploadTitle: 'Vattenstämpla Bild — Lägg till Text och Logotyp Gratis | photremium.com',
      uploadDesc: 'Lägg till text- eller bildvattenstämplar på foton på några sekunder. Gratis, snabbt.',
      uploadKeywords: 'vattenstämpla bild, lägg till vattenstämpel, textvattenstämpel',
      workspaceTitle: 'Vattenstämpla Bild — photremium.com',
      workspaceDesc: 'Lägg till vattenstämplar på bilder gratis online.',
      workspaceKeywords: 'vattenstämpla bild, lägg till vattenstämpel',
    },
    title: 'Vattenstämpla Bild',
    desc: 'Lägg till text- eller logotypvattenstämplar på bilder. Anpassa teckensnitt, opacitet, storlek och position.',
    toWatermark: 'att vattenstämpla',
    watermarkTools: 'Vattenstämpelverktyg',
    addText: 'Lägg till Text',
    addImage: 'Lägg till Bild',
    layersN: 'Lager ({n})',
    noLayers: 'Inga lager har lagts till ännu',
    textLayer: 'Textlager',
    imageLayer: 'Bildlager',
    watermarkDownloadAll: 'Lägg till Stämpel och Ladda ner Alla',
    watermarkDownload: 'Lägg till Stämpel och Ladda ner',
    nextImage: 'Nästa Bild',
    bold: 'Fet',
    italic: 'Kursiv',
    underline: 'Understrykning',
    bgColor: 'Bakgrundsfärg',
    textColor: 'Textfärg',
    alignLeft: 'Vänsterjustera',
    alignCenter: 'Centrera',
    alignRight: 'Högerjustera',
    opacity: 'Opacitet',
    stroke: 'Kontur',
    strokeWidth: 'Konturbredd',
    strokeColor: 'Kontursfärg',
    tileRepeat: 'Plattor/Upprepa',
    tilePattern: 'Plattmönster',
    spacing: 'Avstånd',
    snapToCenter: 'Fäst till centrum',
    duplicate: 'Duplicera',
    delete: 'Ta bort',
    flipHorizontal: 'Vänd Horisontellt',
    flipVertical: 'Vänd Vertikalt',
    rotateLeft: 'Rotera vänster',
    rotateRight: 'Rotera höger',
    cornerRadius: 'Hörnradius',
    borderStroke: 'Ram/Kontur',
    borderWidth: 'Rambredd',
    color: 'Färg',
    style: 'Stil',
    hide: 'Dölj',
    show: 'Visa',
    lock: 'Lås',
    unlock: 'Lås upp',
    solid: 'Solid',
    dashed: 'Streckad',
    dotted: 'Prickad',
    double: 'Dubbel',
    tileSingle: 'Enkel',
    tile2x2: '2×2 Rutnät',
    tile3x3: '3×3 Rutnät',
    removeAllConfirm: 'Ta bort alla bilder och vattenstämplar?',
    dimMismatch: 'Uppladdade bilder har olika dimensioner. För bästa resultat, ladda upp bilder med samma upplösning.',
    clearBackground: 'Rensa Bakgrund',
    typeHere: 'Skriv här...',
    linkCorners: 'Länka Hörn',
    separateCorners: 'Separera Hörn',
  },

  qrGenerator: {
    seo: {
      inputTitle: 'QR-kodsgenerator — Generera och Anpassa Gratis | photremium.com',
      inputDesc: 'Generera anpassade QR-koder för URL, text, WiFi, kontakter, e-post och Google Maps.',
      inputKeywords: 'qr kodsgenerator, skapa qr kod, anpassad qr kod',
      customizeTitle: 'Anpassa QR-kod — photremium.com',
      customizeDesc: 'Anpassa stil, färger, ram och logotyp för din QR-kod. Ladda ner som PNG, JPG, SVG, WEBP eller PDF.',
      customizeKeywords: 'anpassa qr kod, qr kod stil',
    },
    title: 'QR-kodsgenerator',
    desc: 'Generera, anpassa och ladda ner QR-koder för URL, text, WiFi, kontakter, e-post och kartor.',
    generate: 'Generera',
    scanQrCode: 'Skanna QR-kod',
    tabUrl: 'Länk / URL',
    tabText: 'Text',
    tabWifi: 'WiFi',
    tabContact: 'Kontakt',
    tabEmail: 'Gmail',
    tabMaps: 'Google Maps',
    enterUrl: 'Ange URL',
    enterText: 'Ange text',
    networkName: 'Nätverksnamn (SSID)',
    password: 'Lösenord',
    encryption: 'Kryptering',
    hiddenNetwork: 'Dolt Nätverk',
    contactName: 'Kontaktnamn (valfritt)',
    phoneNumber: 'Telefonnummer',
    emailAddress: 'E-postadress',
    subject: 'Ämne (valfritt)',
    body: 'Meddelandetext (valfritt)',
    searchLocation: 'Sök plats',
    urlPlaceholder: 'https://exempel.se',
    textPlaceholder: 'Skriv text här…',
    wifiNamePlaceholder: 'Mitt WiFi',
    passwordPlaceholder: 'lösenord',
    contactPlaceholder: 'Erik Svensson',
    phonePlaceholder: '+46 70 123 45 67',
    emailPlaceholder: 'exempel@gmail.com',
    subjectPlaceholder: 'ämne',
    bodyPlaceholder: 'meddelandetext…',
    locationPlaceholder: 'Sök stad, adress, plats…',
    wpaWpa2: 'WPA / WPA2',
    wep: 'WEP',
    none: 'Ingen',
    characters: 'tecken',
    generateCustomize: 'Generera och Anpassa',
    editQrData: 'Redigera QR-data',
    styleShape: 'Stil och Form',
    colorTab: 'Färger',
    framesTab: 'Ramar',
    logoTab: 'Logotyp',
    templatesTab: 'Mallar',
    fileFormatTab: 'Filformat',
    fgColor: 'Förgrundsfärg',
    bgColor: 'Bakgrundsfärg',
    enableGradient: 'Aktivera Gradient',
    gradientType: 'Gradienttyp',
    linear: 'Linjär',
    radial: 'Radial',
    selectFrame: 'Välj Ram',
    selectLogo: 'Välj Logotyp',
    uploadCustomLogo: 'eller ladda upp din egen logotyp',
    uploadImage: 'Ladda upp Bild',
    downloadFormat: 'Nedladdningsformat',
    preview: 'Förhandsgranskning',
    downloadFormatBtn: 'Ladda ner {format}',
    pngDesc: 'Förlustfri, stöd för transparens',
    jpgDesc: 'Populärt/universellt filformat',
    webpDesc: 'Modernt format, bäst kvalitet/storlek',
    svgDesc: 'Skalbar vektorgrafik',
    pdfDesc: 'Utskriftsklart dokument',
    lat: 'Latitud:',
    lng: 'Longitud:',
    qrCode: 'QR-kod',
    scanMe: 'Skanna Mig',
    scanHere: 'Skanna Här',
    blog: {
      card1: {
        title: '1. Vad är en QR-kod?',
        intro1: 'Fullformen av QR-kod är "Quick Response code" (snabbresponskod). Eftersom informationen i den avkodas mycket snabbt kallas den Quick Response (QR)-kod.',
        intro2: 'QR-kod är en tvådimensionell digital kod som endast kan läsas av maskiner. Data i den kan inte läsas av människor. Den innehåller block för att lagra information som text, telefonnummer, länkar och Google Maps-platser etc.',
        inventionTitle: 'Hur QR-koden uppfanns:',
        inventionText: 'QR-koden uppfanns 1994. Masahiro Hara och hans team arbetade på ett japanskt företag kallat Denso Wave, som tillverkade bildelar för Toyota. De ville ha en kod som lagrar mycket mer information än en vanlig streckkod, och så uppfann de QR-koden.',
        keyFeaturesTitle: 'Viktiga egenskaper hos en QR-kod',
        keyFeatures: [
          {
            title: 'Hur QR fungerar',
            text: 'Du matar in texten eller länken för att generera en QR-kod för den. QR-generatorn skapar fyrkantig boxare enligt informationen. Varje låda representerar en bit, och varje bit lagrar ett tecken.',
          },
          {
            title: 'Struktur av QR-kod',
            text: 'En QR-kod innehåller tre stora fyrkantiga rutor för att identifiera orienteringen av QR-koden och en liten fyrkantig ruta för att lagra bitarna (informationen).',
          },
          {
            title: 'Datakapacitet för QR-kod',
            text: 'Vanligtvis lagrar en QR-kod mer information än en streckkod. QR-kod är helt enkelt en avancerad version av streckkod. Det är i grunden en tvådimensionell streckkod. En QR-kod lagrar närmare 200 tecken. Den kan också lagra 400 tecken men kan vara svår att skanna. Om du lagrar mer än 400 tecken kan det resultera i en mycket komplex QR-kod som inte kan skannas för det mesta.',
          },
          {
            title: 'Feldetektering i QR-koder',
            text: 'En QR-kod kan fortfarande skannas om en del av informationen är skrapad eller några bitar vänds om. QR-kod använder Reed-Solomon-felteknikmetod för att detektera fel och lösa dem efter identifiering.',
          },
        ],
        errorTitle: 'QR-kodens felkorrigeringsnivå:',
        errorIntro: 'Olika felteknik- och korrigeringsmetoder används i olika fall enligt beskrivningen nedan:',
        errorHeaders: {
          level: 'Nivå',
          recovery: 'Återställningskapacitet',
          bestUse: 'Bästa användningsfall',
        },
        errorRows: [
          {
            level: 'Låg (L)',
            recovery: '~7%',
            useCases: [
              'Denna felteknik används när QR-kod visas på digitala skärmar, webbplatser eller i en ren miljö.',
              'När en QR-kod genereras för liten information som Gmail, kontaktnummer eller liten text.',
            ],
          },
          {
            level: 'Medel (M)',
            recovery: '~15%',
            useCases: [
              'För broschyrer och affischer som är installerade i ren miljö och när skaderisk är försumbar.',
            ],
          },
          {
            level: 'Kvartil (Q)',
            recovery: '~25%',
            useCases: [
              'När QR-kod ska installeras i hård miljö som i fabrik/utomhus.',
              'Även när en liten logotyp behövs i mitten, täcker den vissa bitar. Så denna felteknik är nödvändig.',
            ],
          },
          {
            level: 'Hög (H)',
            recovery: '~30%',
            useCases: [
              'Används när allvarlig skada på QR-koden är möjlig.',
              'När stora logotyper täcker mitten av QR-koden.',
              'Även när tung styling behövs för QR-koden.',
            ],
          },
        ],
      },
      card2: {
        title: '2. Varför välja vår QR-kodgenerator?',
        intro: 'Vår QR-kodgenerator gör QR-kodgenerering extremt snabb, säker och enkel. Du kan anpassa din kod för att göra den mer avancerad, professionell och matchande med ditt företagstema. Alla anpassningar från färgning av QR-kod till logotypinstallation i QR-kod erbjuds gratis för alltid.',
        strengths: [
          {
            title: 'Professionell anpassning:',
            text: 'Du kan generera och anpassa så många QR-koder som du behöver utan kostnad. Alla funktioner är helt gratis. Du kan använda gradientfärger, olika former för fyrkantiga rutor, anpassade logotyper och många andra funktioner.',
          },
          {
            title: 'Stöd för flera format:',
            text: 'Vår QR-kodgenerator erbjuder flera nedladdningsformat för din bekvämlighet. Du behöver bara välja ditt föredragna format innan du laddar ner. För närvarande erbjuder vi dessa format:',
          },
          {
            title: 'Färdiga mallar:',
            text: 'Du kan använda färdiga gradientfärger och ramar som gör din QR-kod professionell.',
          },
          {
            title: 'Stöd för anpassad logotyp:',
            text: 'Du kan också ladda upp din anpassade varumärkeslogotyp som passar automatiskt i mitten av QR-koden. Du kan också välja logotyp från inbyggt logotypbibliotek där mer än 30 logotyper tillhandahålls.',
          },
          {
            title: 'Live-förhandsgranskning:',
            text: 'Medan du anpassar kan du titta på alla ändringar i live-förhandsgranskningspanelen. Dessa ändringar i förhandsgranskningspanelen är i realtid och ändras dynamiskt.',
          },
          {
            title: 'Skanningsindikator:',
            text: 'Vid val av färger vägleder korrekta varningar och indikatorer dig om du väljer färger som är svåra att skanna.',
          },
        ],
        formatHeaders: {
          srNo: 'Nr.',
          formats: 'Format',
          description: 'Beskrivning',
        },
        formatRows: [
          { no: '1', format: 'PNG', description: 'Förlustfritt, stöd för transparens' },
          { no: '2', format: 'JPG', description: 'Populärt, universellt filformat' },
          { no: '3', format: 'WEBP', description: 'Modernt, bästa kvalitet/storlek' },
          { no: '4', format: 'SVG', description: 'Skalbar vektorgrafik' },
          { no: '5', format: 'PDF', description: 'Utskriftsklart dokument' },
        ],
      },
      card3: {
        title: '3. Steg för steg guide:',
        step1Intro: 'Välj först kategorin för den QR-kod du vill generera. Oavsett om du genererar QR-kod för kontakt, karta, länk eller text. För närvarande erbjuder vår QR-kodgenerator dessa kategorier:',
        categories: ['Länk / URL', 'Text', 'WiFi', 'Kontakt', 'Gmail', 'Google Maps'],
        step2: 'Efter att ha valt kategorin klister du din information i textrutan därefter.',
        step3Intro: 'Klicka sedan på Generera och anpassa för att öppna anpassningspanelen. I anpassningspanelen ser du ett undernavigationsfält med följande alternativ:',
        options: [
          {
            title: 'Stil och form:',
            text: 'I det här avsnittet kan du ändra formerna på fyrkantiga rutor till flera stilar som avrundade hörn, punkter, horisontella staplar, vertikala staplar, små kvadrater och många andra.',
          },
          {
            title: 'Färg:',
            text: 'Du kan välja anpassade bakgrunds- och förgrundsfärger i det här avsnittet. För att göra din QR-kod i gradientfärger har du möjligheten att aktivera gradient som låter dig använda valfri gradientfärg från inbyggt bibliotek eller skapa din egen gradientfärg enkelt. Du kan också ändra vinkeln för linjär gradientfärg. Radialgradient stöds också. Du kan lägga till flera färger för att skapa en professionell gradienteffekt.',
          },
          {
            title: 'Ramar:',
            text: 'Här kan du välja en perfekt ram för din QR-kod. Alla ramar passar automatiskt in i din kod automatiskt. Du behöver bara välja en ram från det inbyggda biblioteket.',
          },
          {
            title: 'Logotyp:',
            text: 'Efter ramval kan du välja en logotyp som automatiskt justeras i mitten av QR-koden. Det går också att ladda upp din anpassade varumärkeslogotyp.',
          },
          {
            title: 'Mallar:',
            text: 'Om du inte vill välja stil, form, färg och ram separat kan du tillämpa färdiga mallar på din QR-kod. Flera premiummallar tillhandahålls för din bekvämlighet som är gratis för alltid.',
          },
          {
            title: 'Filformat:',
            text: 'Slutligen måste du välja den filtyp som du vill ladda ner QR-koden i. Flera vanliga format stöds inklusive PNG, WEBP, SVG och PDF etc.',
          },
          {
            title: 'Redigera QR-data:',
            text: 'Du kan också redigera dina QR-data utan någon förlust i dina valda anpassningar.',
          },
        ],
        finalStep: 'Klicka sedan på nedladdningsknappen och QR-koden enligt dina anpassningar i det valda formatet laddas ner omedelbar utan kostnad.',
      },
      card4: {
        title: '4. Fördelar:',
        intro: 'QR-kod förbinder den fysiska världen med den digitala upplevelsen. Det är det snabbaste sättet att dela länkar, kontakt eller din plats. Du behöver bara skanna den QR-koden för att få omedelbar tillgång till informationen. Därför är det mycket populärt inom företag och digital värld för att vara tidseffektivt och mycket målstyrt.',
        benefits: [
          {
            title: 'Stöd för möjligheter:',
            text: 'QR-koder fungerar för alltid utan utgångsdatum. De ger dig den lagrade informationen omedelbar när du skannar den. Eftersom den lagrar hårdkodad digital instruktion förlorar den aldrig sin information.',
          },
          {
            title: 'Offline-stöd:',
            text: 'Du kan skanna QR-koden även om du är offline. Din mobilkamera avkodar QR-kodmönstren och ger dig informationen som lagras i den.',
          },
          {
            title: 'Ingen kostnad:',
            text: 'Eftersom dessa koder inte kräver någon serveromdirigering eller resurser är det gratis för alltid.',
          },
        ],
      },
    },
  },

  qrScanner: {
    seo: {
      title: 'QR-kodsläsare — Skanna QR-koder med Kamera eller Bild | photremium.com',
      desc: 'Skanna QR-koder direkt med kamera eller ladda upp bild. Identifierar URL, text, WiFi, kontakter med mera.',
      keywords: 'qr kodsläsare, skanna qr kod, qr läsare, qr kod online',
    },
    title: 'QR-kodsläsare',
    desc: 'Skanna QR-koder direkt med kamera eller ladda upp bild. Snabbt och säkert.',
    generateQrCode: 'Generera QR-kod',
    scan: 'Skanna',
    cameraScanner: 'Kameraskanner',
    uploadImage: 'Ladda upp Bild',
    pointCamera: 'Rikta kameran mot QR-koden',
    startCamera: 'Starta Kamera',
    loading: 'Laddar…',
    dropQrImage: 'Släpp QR-kodsbild här',
    toScan: 'att skanna',
    supportedFormats: 'Stöder JPG, PNG, GIF, WEBP',
    ctrlVPaste: 'Klistra in med Ctrl+V',
    scanFromGallery: 'Skanna från Galleri',
    instantScanning: 'Omedelbar Skanning',
    instantScanningDesc: 'QR-kodsdetektering i realtid från kamera eller uppladdade bilder',
    private100: '100% Privat',
    private100Desc: 'All bearbetning sker i din webbläsare. Ingenting laddas upp',
    multiFormat: 'Flera Format',
    multiFormatDesc: 'Identifiera URL:er, text, WiFi, kontakter, e-post, telefon och mer',
    accessingCamera: 'Åtkommer kamera…',
    cameraDenied: 'Kameraåtkomst nekad. Tillåt kamerabehörigheter och försök igen.',
    noCamera: 'Ingen kamera hittades på den här enheten.',
    cameraError: 'Kan inte komma åt kamera. Försök igen.',
    videoError: 'Kunde inte starta videouppspelning.',
    switchError: 'Kunde inte byta kamera.',
    tryAgain: 'Försök Igen',
    switchCamera: 'Byt Kamera',
    stop: 'Stoppa',
    noQrFound: 'Ingen QR-kod Hittades',
    couldNotRead: 'Kunde inte läsa bilden',
    scannerFailed: 'Kunde inte ladda skannern',
    noQrFoundDesc: 'Ingen QR-kod identifierades i bilden. Prova en annan bild eller använd kameraskannern.',
    qrScanned: 'QR-kod Skannad!',
    openLink: 'Öppna Länk',
    copied: 'Kopierat!',
    copy: 'Kopiera',
    share: 'Dela',
    scanAgain: 'Skanna Igen',
    network: 'Nätverk',
    password: 'Lösenord',
    security: 'Säkerhet',
    unknown: 'Okänd',
    typeText: 'Text',
    typeUrl: 'URL',
    typeWifi: 'WiFi-nätverk',
    typeContact: 'Kontaktkort',
    typeEmail: 'E-post',
    typePhone: 'Telefonnummer',
    typeSms: 'SMS',
    typeLocation: 'Plats',
    blog: {
      tocTitle: 'Innehåll',
      sections: [
        {
          id: 'why-use-qr-code-scanner',
          title: '1. Varför använda en QR-kodsläsare?',
          paragraphs: [
            'En QR-kodsläsare är i grunden en mobilkamera som avkodar informationen som lagras i en QR-kod. Du behöver bara rikta kameran mot QR-koden, och oavsett orientering läser den mönstren, upptäcker fel, korrigerar dem vid behov och visar informationen som finns i koden.',
          ],
          listTitle: 'Typer av QR-kodsläsare:',
          bullets: [
            'Webbaserad QR-kodsläsare: Du kan skanna QR-koder med online-läsare som stöds av din webbläsare. Du kan få information via kamera eller genom att ladda upp en bild. För automatisk omdirigering och fler avancerade funktioner kan du besöka https://photremium.com.',
            'Mobilkameror: Vissa moderna mobiler har inbyggd QR-kodsläsning i den vanliga kameraappen. De kan hämta och avkoda information genom att bara skanna QR-koden med kameran.',
            'Appar: Det finns appar som är särskilt byggda för att skanna QR-koder. För avancerad omdirigering och många andra funktioner kan du dock använda verktyget gratis via https://photremium.com.',
            'Hårdvaruenheter: Vissa hårdvaruenheter är också gjorda för att skanna QR-koder. Dessa används ofta i stora köpcentrum för kassahantering.',
          ],
        },
        {
          id: 'why-choose-our-qr-code-scanner',
          title: '2. Varför välja vår QR-kodsläsare?',
          paragraphs: [
            'Du får tillgång till flera avancerade funktioner, från omdirigering till kopiering av innehållet, dekodfierat från QR-koden. Du kan även utforska många andra smarta funktioner i vår QR-kodsläsare:',
          ],
          bullets: [
            'Hög hastighet: Vår QR-kodsläsare gör avkodningen mycket snabb. Skanna bara koden och verktyget visar informationen direkt med alternativ för att kopiera text/länk, öppna länk om den upptäcks eller automatiskt spara om en kontakt upptäcks.',
            'Ingen installation krävs: Du behöver inte installera någon separat app för att använda vår QR-kodsläsare. Verktyget fungerar gratis direkt i din webbläsare.',
            'Plattformsoberoende: Du kan använda verktyget på vilken enhet som helst. Ingen oro för OS-version eller andra krav. Det stöds på alla versioner och enheter.',
            'Alla format stöds: Alla datatyper som kan lagras i en QR-kod, inklusive vanlig text, WiFi, URL:er, kontakter, Gmail och Google Maps, stöds av vårt verktyg.',
          ],
        },
        {
          id: 'step-by-step-guide',
          title: '3. Steg-för-steg-guide:',
          steps: [
            {
              heading: '1. Välj först metod för att skanna QR-koden. Det finns två sätt:',
              subSteps: [
                {
                  heading: 'i. Kamerametod',
                  paragraphs: [
                    'Du kan skanna QR-koden med enhetens kamera, oavsett om du använder laptop, PC eller annan enhet med kamera. När du klickar på knappen “Starta Kamera” visas en behörighetsförfrågan. Tillåt behörigheten för att ge webbplatsen kameratillgång för QR-skanning. Om du av misstag nekat eller inte ser förfrågan kan du ge kameratillgång manuellt:',
                  ],
                  notes: [
                    '➔ För Chrome (Android / Desktop):',
                    '1. Klicka på de tre prickarna',
                    '2. Gå till Inställningar',
                    '3. (Hoppa över detta steg på Android) Sekretess och säkerhet',
                    '4. Klicka på Webbplatsinställningar',
                    '5. Klicka sedan på Kamera under Behörigheter',
                    '6. Hitta vår URL: https://photremium.com/qr-code-scanner',
                    '7. Tillåt kamera i rullgardinsmenyn.',
                    '➔ För Safari (iPhone / iOS):',
                    '1. Tryck på AA-ikonen eller Webbplatsinställningar i adressfältet.',
                    '2. Välj Webbplatsinställningar.',
                    '3. Tryck på Kamera och välj Tillåt.',
                    '4. Om det fortfarande är blockerat: gå till iPhone-inställningar > Safari > Kamera och välj Fråga eller Tillåt.',
                  ],
                },
                {
                  heading: 'ii. Gallerimetod',
                  paragraphs: [
                    'Du kan ladda upp en bild av en QR-kod för att hämta informationen. Klicka på knappen “Skanna från Galleri” för att öppna filutforskaren. Välj sedan QR-kodsbilden. Alla bildformat stöds, till exempel jpg, .jpeg, .png, .gif, .webp, .svg, .avif, .heic, .heif, .jxl, .bmp, .ico, .tiff, .tif, .jfif, .jpe, .pjpeg, .pjp, .apng, .svgz och .xbm.',
                  ],
                },
              ],
            },
            {
              heading: '2. När du har valt QR-koden visas all information, så att du kan kopiera, dela eller öppna länken om den upptäcks. Du kan också skanna igen när du vill.',
            },
          ],
        },
        {
          id: 'benefits-of-qr-code-scanner',
          title: 'Fördelar med QR-kodsläsare:',
          paragraphs: [
            'QR-kodsläsare ger flera fördelar i den digitala världen. De gör betalningar, verifiering och åtkomst till information enkelt och snabbt, även offline.',
          ],
          bullets: [
            'Omedelbar åtkomst till information: Skanning av en QR-kod ger information på några millisekunder. Den avkodar mönster, upptäcker fel och rättar dem snabbt, vilket ger en mycket snabb upplevelse.',
            'Smidig kommunikation: I dagens utvecklade samhälle behövs snabb och säker kommunikation för små informationsmängder som bank- och produktuppgifter. QR-kodsläsare löser detta eftersom betalningar görs genom att skanna en QR-kod. Google verifierar också mobiltelefon via QR när ett nytt konto skapas på laptop.',
            'E-biljetter: På busstationer, tågstationer och flygplatser kan du enkelt verifiera biljetter utan att vänta länge i kö. QR-skannrar installeras ofta på flera platser för att minska köer, vilket också minskar personalbehov och kostnader.',
            'Produktautentisering: Avancerade varumärken placerar QR-koder på produkter. Kunder kan skanna koden för att kontrollera om produkten är äkta.',
          ],
        },
      ],
    },
  },

  faceBlur: {
    seo: {
      uploadTitle: 'Ansiktsoskärpa Verktyg — Sudda Ansikten i Bilder Online | photremium.com',
      uploadDesc: 'Identifiera och sudda automatiskt ansikten i bilder med AI. Välj intensitet, form eller emoji.',
      uploadKeywords: 'ansiktsoskärpa, sudda ansikte, ansiktsigenkänning, integritetsverktyg',
      workspaceTitle: 'Ansiktsoskärpa Verktyg — photremium.com',
      workspaceDesc: 'Sudda automatiskt ansikten i bilder. 100% gratis.',
      workspaceKeywords: 'ansiktsoskärpa, ansiktsidentifiering',
    },
    title: 'Ansiktsoskärpa',
    desc: 'Identifiera och sudda automatiskt ansikten i bilder för att skydda integriteten.',
    toBlurFaces: 'att sudda ansikten',
    autoDetection: 'Automatisk Identifiering',
    autoDetectionDesc: 'AI-driven ansiktsidentifiering hittar alla ansikten direkt',
    customBlur: 'Anpassad Oskärpa',
    customBlurDesc: 'Justera intensitet, form och stil för oskärpan',
    private100: '100% Privat',
    private100Desc: 'All bearbetning sker lokalt i webbläsaren',
    blurTools: 'Oskärpaverktyg',
    faces: 'Ansikten',
    faceDetection: 'Ansiktsidentifiering',
    detecting: 'Identifierar...',
    autoDetectFaces: 'Identifiera Ansikten Automatiskt',
    exitManualMode: 'Avsluta Manuellt Läge',
    manualSelect: 'Manuellt Val',
    nFaceRegions: 'Hittade {n} ansiktsregioner',
    noFacesDetected: 'Inga ansikten identifierade — använd manuellt läge',
    manualHint: 'Klicka och dra för att rita en rektangel över det område du vill sudda.',
    blurType: 'Oskärpotyp',
    blur: 'Oskärpa',
    emoji: 'Emoji',
    blurIntensity: 'Oskärpointensitet',
    strength: 'Styrka',
    blurShape: 'Oskärpoform',
    rectangle: 'Rektangel',
    ellipse: 'Ellips',
    circle: 'Cirkel',
    chooseEmoji: 'Välj Emoji',
    blurRegionsN: 'Oskärporegioner ({n})',
    faceN: 'Ansikte {n}',
    manualRegionN: 'Manuell Region {n}',
    manualN: 'Manuell {n}',
    clearAllRegions: 'Rensa Alla Regioner',
    processingDots: 'Bearbetar...',
    downloadBlurred: 'Ladda ner Suddad Bild',
    downloadNImages: 'Ladda ner {n} bilder',
    downloadDialogTitle: 'Inte Alla Bilder Är Redigerade',
    downloadDialogText: 'Redigerade {edited} av {total}.',
    downloadAll: 'Ladda ner Alla',
    removeRegion: 'Ta bort Region',
    region: 'Region',
    notAllEdited: 'Inte Alla Bilder Är Redigerade',
    editedXofY: 'Redigerade {edited} av {total}.',
    nextImage: 'Nästa Bild',
  },

  faqData: {
    imageConverter: [
      { q: 'Vilka bildformat stöds för konvertering?', a: 'Vi stöder JPG, PNG, WEBP, SVG, GIF, BMP, ICO och TIFF. Du kan direkt konvertera mellan dessa format i webbläsaren.' },
      { q: 'Bevaras bildkvaliteten vid konvertering?', a: 'För förlustfria format som PNG bevaras kvaliteten fullt ut. För förlustkomprimerade format som JPG och WEBP använder vi optimerade kodningsinställningar.' },
      { q: 'Finns det begränsningar för storlek eller antal filer?', a: 'Inga strikta begränsningar. Du kan ladda upp flera bilder åt gången och konvertera dem i batch.' },
      { q: 'Är mina data säkra? Skickas bilder till en server?', a: 'Absolut. All bearbetning sker i din webbläsare. Dina bilder lämnar aldrig din enhet.' },
      { q: 'Kan jag konvertera transparent PNG till JPG?', a: 'Ja. Eftersom JPG inte stöder transparens fylls transparenta områden som standard med en vit bakgrund.' },
    ],
    imageCompressor: [
      { q: 'Minskar komprimering bildens kvalitet?', a: 'Nej, komprimering påverkar normalt inte bildkvaliteten så länge du håller dig inom rekommenderade nivåer. Indikatorerna visar kvaliteten: i. Komprimering 1% till 40%: grön indikator med meddelandet “Bra kvalitet”. ii. Komprimering 41% till 60%: gul indikator med meddelandet “Normal kvalitet”. Detta intervall är vanligtvis mest rekommenderat. iii. Komprimering 61% till 100%: systemet visar en röd varning “Dålig kvalitet”, och kvalitetsförlusten kan bli tydlig.' },
      { q: 'Vilka bildformat stöds för komprimering?', a: 'Vårt bildkomprimeringsverktyg stöder alla följande format:\n.jpg .jpeg .png .gif .webp .svg .avif .heic .heif .jxl .bmp .ico .tiff .tif .jfif .jpe .pjpeg .pjp .apng .svgz .xbm' },
      { q: 'Kan jag komprimera flera bilder samtidigt?', a: 'Ja, absolut. Du kan komprimera flera bilder samtidigt (även 100+) om din enhet klarar det. Eftersom komprimering använder enhetens resurser får du bättre prestanda med en kraftfull laptop, PC eller mobil. Om din enhet är svagare kan du komprimera i omgångar; verktyget är fortfarande gratis även då.' },
      { q: 'Lagrar eller laddar ni upp våra bilder till era servrar?', a: 'Nej, vi laddar aldrig upp eller lagrar dina bilder på våra servrar. Alla bilder komprimeras lokalt i din webbläsare. Dina filer lämnar aldrig din enhet, så du kan tryggt komprimera personliga eller privata bilder.' },
      { q: 'Är det här bildkomprimeringsverktyget gratis att använda?', a: 'Ja, vårt bildkomprimeringsverktyg är helt gratis för alltid. Vi kommer aldrig att kräva betalning. Det finns inga dolda avgifter. Alla funktioner, inklusive komprimering av flera bilder, är gratis.' },
    ],
    cropImage: [
      { q: 'Försämras bildkvaliteten när man beskär en bild?', a: 'Nej, att beskära en bild påverkar inte bildens visuella kvalitet alls. Beskärning tar bara bort den oönskade delen. Den ändrar aldrig pixlarna i den del som blir kvar efter beskärning. Därför kan du beskära dina bilder i originalkvalitet utan någon pixel­skada.' },
      { q: 'Vilka bildformat stöds av bildbeskärningsverktyget?', a: 'Du kan välja bild i vilket format som helst eftersom vårt bildbeskärningsverktyg stöder nästan alla bildformat. De listas nedan:\n.jpg .jpeg .png .gif .webp .svg .avif .heic .heif .jxl .bmp .ico .tiff .tif .jfif .jpe .pjpeg .pjp .apng .svgz .xbm' },
      { q: 'Laddas mina bilder upp till er server?', a: 'Nej, all bearbetning sker i din lokala webbläsare. Dina bilder laddas aldrig upp till vår server eftersom de aldrig lämnar din enhet. Därför kan du beskära privata bilder med vårt verktyg utan någon risk.' },
      { q: 'Kan jag beskära flera bilder samtidigt?', a: 'Ja, du kan beskära flera bilder (även 100+) samtidigt om ditt system stöder det. Eftersom beskärning använder systemresurser kan du med en högpresterande laptop, PC eller mobil beskära många bilder på en gång. Om du har en enklare enhet kan du beskära i omgångar, eftersom verktyget är gratis även vid stora mängder bilder.' },
      { q: 'Är det här bildbeskärningsverktyget gratis att använda?', a: 'Ja, det här bildbeskärningsverktyget är helt gratis för alltid. Du kan använda det var som helst, när som helst och på vilken enhet som helst. Du får en responsiv upplevelse för alla enheter och du kommer aldrig att bli ombedd att betala för premiumfunktioner. Alla funktioner är helt gratis utan dolda avgifter.' },
    ],
    resizeImage: [
      { q: 'Kan jag ändra storlek på flera bilder samtidigt?', a: 'Absolut. Vårt verktyg stöder samtidig storleksändring av flera bilder. Du kan ladda upp så många bilder som din enhet klarar, och AI-motorn bearbetar dem samtidigt. På svagare enheter är det bättre att köra i batchar för att undvika seghet. Allt sker lokalt utan serveruppladdning, vilket skyddar din integritet.' },
      { q: 'Är detta verktyg gratis?', a: 'Ja, verktyget är helt gratis för alltid. Du behöver ingen betald prenumeration för premiumfunktioner. Det finns heller inga dolda avgifter när du laddar ner storleksändrade bilder.' },
      { q: 'Förlorar bilden kvalitet när jag ändrar storlek?', a: '✅Decrease Size (downscale): Att minska bildstorleken försämrar inte den visuella kvaliteten. I många fall kan den nedskalade bilden till och med upplevas skarpare. Att minska storleken orsakar därför normalt ingen kvalitetsförlust.\n❌Increase Size (upscale): Att förstora en bild över originalstorleken kan påverka den visuella kvaliteten. Ju mer du förstorar, desto större risk för kvalitetsförlust.' },
      { q: 'Är verktyget säkert?', a: 'Ja, verktyget är säkert, särskilt för personliga och känsliga bilder. All bearbetning sker lokalt på din enhet och ingen data lämnar den. Du kan ändra storlek utan integritetsrisk.' },
      { q: 'Vilka bildformat stöds?', a: 'Vårt storleksverktyg stöder alla bildformat. Du kan välja bilder i följande format:\n.jpg .jpeg .png .gif .webp .svg .avif .heic .heif .jxl .bmp .ico .tiff .tif .jfif .jpe .pjpeg .pjp .apng .svgz .xbm' },
    ],
    removeBackground: [
      { q: 'Hur fungerar bakgrundsborttagning?', a: 'Vi använder avancerade AI-modeller som körs direkt i webbläsaren för att identifiera motivet och separera det från bakgrunden.' },
      { q: 'Fungerar det för komplexa bakgrunder?', a: 'Ja. AI-modellen hanterar olika scener. Bästa resultat uppnås med tydlig kontrast mellan motiv och bakgrund.' },
      { q: 'Kan jag ta bort bakgrunden från flera bilder åt gången?', a: 'Ja. Ladda upp flera bilder och verktyget bearbetar dem sekventiellt.' },
      { q: 'Vilket utdataformat används?', a: 'Utdata är alltid en PNG-fil med transparent bakgrund.' },
      { q: 'Skickas mina bilder till en server?', a: 'Nej. AI-modellen körs helt i webbläsaren med WebAssembly.' },
    ],
    watermarkImage: [
      { q: 'Vilka typer av vattenstämplar kan läggas till?', a: 'Du kan lägga till textvattenstämplar med anpassade typsnitt, storlekar, färger och opacitet, samt bildvattenstämplar som logotyper.' },
      { q: 'Kan jag använda samma vattenstämpel på flera bilder?', a: 'Ja. Ladda upp flera bilder, konfigurera vattenstämpeln en gång och den tillämpas på alla.' },
      { q: 'Minskar vattenstämpeln bildkvaliteten?', a: 'Nej. Vattenstämpeln komponeras på originalbilden i full upplösning.' },
      { q: 'Kan jag justera vattenstämpelns opacitet?', a: 'Absolut. Använd opacitetsreglaget för att justera.' },
      { q: 'Skickas data till en server?', a: 'Nej. All vattenstämpelhantering sker lokalt i webbläsaren.' },
    ],
    qrCodeGenerator: [
      { q: 'Förfaller denna QR-kod?', a: 'Nej, dessa QR-koder förfaller inte och garanterar livslång support. Eftersom de lagrar hårdkodade instruktioner i form av bitar i kvadratiska rutor, kan informationen som lagras i dem inte ändras eller tas bort. Du kan komma åt information i koden bara genom att skanna den med valfri kamera, även efter år.' },
      { q: 'Varför kan min QR-kod inte skannas?', a: 'Din QR-kod kanske inte kan skannas av följande skäl: i. Låg kontrast: Om du väljer liknande bakgrunds- och förgrundsfärger, påverkar det QR-kodens synlighet och orsakar skanningsfel. Men vårt verktyg guidar dig under anpassningen om låg kontrast eller något annat skanningsrelaterat problem. ii. Stora data: Om du genererar en QR-kod för mycket stor text eller data, blir den mycket komplex och orsakar problem vid skanningen. En textlängsvalidator guidar dig om den optimala textlängden under QR-kodgenerering. iii. Suddig utskrift: Se till att du laddar ner din QR-kod i höga upplösningsformat som PNG eller SVG, som redan stöds av vårt verktyg.' },
      { q: 'Kan jag lägga till logotyp i QR-koden?', a: 'Absolut, du kan lägga till en anpassad logotyp eller välja en från det inbyggda logotypbiblioteket för din QR-kod. Din valda logotyp justeras automatiskt i mitten av QR-koden.' },
      { q: 'Hur kan jag skanna QR-koden?', a: 'Du kan skanna QR-koden med din mobilkamera. Men för automatisk omdirigering till länken och många fler avancerade funktioner kan du besöka vår QR-kodskanner gratis med länken https://photremium.com/qr-code-scanner.' },
      { q: 'Hur många QR-koder kan jag generera gratis?', a: 'OBEGRÄNSAD! du kan generera flera QR-koder gratis. Alla funktioner, anpassningar och mallar är gratis för alltid för alla. Du behöver inte prenumerera för att njuta av premiumfunktioner.' },
      { q: 'Behöver jag logga in/registrera mig för att generera QR-kod?', a: 'Nej, bara ange din text, generera QR-koden och ladda ner efter anpassning. Det finns ingen anledning att logga in eller registrera dig eftersom alla funktioner kan nås helt gratis.' },
    ],
    qrCodeScanner: [
      { q: 'Kan jag skanna QR-koder från sparade bilder och skärmdumpar?', a: '**Ja**, du kan skanna en QR-kod från sparade bilder eller skärmdumpar. Vår QR-kodsläsare på https://photremium.com/qr-code-scanner låter dig skanna QR-koder från galleriet. Välj bara bilden så får du all information som finns i QR-koden.' },
      { q: 'Behöver jag installera en app för QR-kodsläsaren?', a: '**Nej**, vår webbaserade QR-kodsläsare låter dig skanna QR-koder utan appinstallation. Du kan använda vår avancerade QR-kodsläsare gratis på vilken enhet som helst.' },
      { q: 'Varför känner skannern inte igen QR-koden?', a: 'QR-koden kanske inte skannas av någon av följande orsaker: i. Otillräckligt ljus: Att skanna i svagt ljus kan ge problem. Slå på ficklampan och öka skärmens ljusstyrka om du skannar från en skärm. ii. Avstånd: Fel avstånd kan också orsaka problem. Optimalt avstånd är cirka 10 tum (25 cm). iii. Smutsig kameralins: QR-koder kan misslyckas om linsen är smutsig. Rengör linsen innan skanning. “Ser du en rutnätsruta i skannern? Placera QR-koden i rutan för att skanna den korrekt.”' },
      { q: 'Kan verktyget skanna en inverterad eller färgstark QR-kod?', a: '**Ja**, du kan skanna QR-koder i valfri färg eller orientering. Om kontrasten mellan bakgrund och förgrund är låg kan skanningen dock bli svårare.' },
      { q: 'Är detta verktyg gratis att använda?', a: '**Ja**, detta verktyg är helt gratis att använda. Du kan skanna obegränsat antal QR-koder gratis för alltid.' },
    ],
    faceBlur: [
      { q: 'Hur fungerar ansiktsidentifiering?', a: 'Den AI-drivna ansiktsidentifieringsmodellen körs direkt i din webbläsare. Den identifierar ansikten i bilder.' },
      { q: 'Kan jag välja vilka ansikten som ska suddas?', a: 'Ja. Efter identifiering markeras varje ansiktsregion och du kan välja vilka ansikten du vill sudda.' },
      { q: 'Vilka oskärpastilar finns tillgängliga?', a: 'Du kan välja Gaussisk oskärpa, pixelisering eller solidfärgsöverlägg och justera intensiteten.' },
      { q: 'Kan jag sudda ansikten i flera bilder åt gången?', a: 'Ja. Ladda upp flera bilder, konfigurera oskärporegionerna och ladda ner alla bearbetade bilder.' },
      { q: 'Skickas mina foton till externa servrar?', a: 'Nej. AI-modellen körs i din webbläsare med WebAssembly.' },
    ],
    photoEditor: [
      { q: 'Vilka redigeringsfunktioner finns tillgängliga?', a: 'Justera ljusstyrka, kontrast, mättnad, tillämpa filter, lägga till text, överlägg, ramar och klistermärken — allt i webbläsaren.' },
      { q: 'Kan jag ångra och göra om ändringar?', a: 'Ja. Redigeraren stöder fullständig ångra/gör om-historik.' },
      { q: 'Vilka filformat kan redigeras och exporteras?', a: 'Du kan redigera JPG, PNG, WEBP och andra populära format.' },
      { q: 'Fungerar redigeraren på telefoner?', a: 'Ja. Redigeraren är helt responsiv och pekskärmsvänlig.' },
      { q: 'Lagras mina bilder på en server?', a: 'Nej. All redigering sker lokalt.' },
    ],
  },
};

export default sv;
