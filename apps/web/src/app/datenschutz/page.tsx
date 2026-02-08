import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Datenschutzerklärung | Builderly',
  description: 'Datenschutzerklärung von Builderly - Informationen zur Verarbeitung Ihrer personenbezogenen Daten.',
};

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Datenschutzerklärung</h1>
        
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-8">
            Stand: {new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Verantwortlicher</h2>
            <p>
              Verantwortlicher für die Datenverarbeitung auf dieser Website ist:
            </p>
            <address className="not-italic bg-muted p-4 rounded-lg mt-4">
              <strong>[Ihr Unternehmen]</strong><br />
              [Straße und Hausnummer]<br />
              [PLZ Ort]<br />
              Deutschland<br /><br />
              E-Mail: datenschutz@builderly.dev<br />
              Telefon: [Telefonnummer]
            </address>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Erhebung und Speicherung personenbezogener Daten</h2>
            
            <h3 className="text-lg font-medium mt-6 mb-3">2.1 Bei der Registrierung</h3>
            <p>
              Bei der Registrierung erheben wir folgende Daten:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>E-Mail-Adresse (erforderlich)</li>
              <li>Name (optional)</li>
              <li>Passwort (verschlüsselt gespeichert)</li>
              <li>Zeitpunkt der Registrierung</li>
              <li>Zustimmung zur Datenschutzerklärung</li>
              <li>Zustimmung zu Marketing-E-Mails (optional)</li>
            </ul>
            <p className="mt-4">
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) und 
              Art. 6 Abs. 1 lit. a DSGVO (Einwilligung für Marketing).
            </p>

            <h3 className="text-lg font-medium mt-6 mb-3">2.2 Bei der Nutzung unseres Dienstes</h3>
            <p>
              Während der Nutzung unseres Website-Builders speichern wir:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Von Ihnen erstellte Websites und Seiten</li>
              <li>Hochgeladene Medien und Dateien</li>
              <li>Workspace- und Team-Mitgliedschaften</li>
              <li>Aktivitätsprotokolle (für Sicherheit und Compliance)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Cookies und ähnliche Technologien</h2>
            <p>
              Wir verwenden verschiedene Arten von Cookies:
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-3">3.1 Notwendige Cookies</h3>
            <p>
              Diese Cookies sind für den Betrieb der Website erforderlich und können nicht 
              deaktiviert werden. Sie speichern z.B. Ihre Login-Session.
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-3">3.2 Analyse-Cookies</h3>
            <p>
              Mit Ihrer Einwilligung nutzen wir Analyse-Cookies, um zu verstehen, 
              wie Besucher unsere Website nutzen.
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-3">3.3 Marketing-Cookies</h3>
            <p>
              Mit Ihrer Einwilligung können Marketing-Cookies verwendet werden, 
              um Ihnen relevante Werbung anzuzeigen.
            </p>
            
            <p className="mt-4">
              Sie können Ihre Cookie-Einstellungen jederzeit über den Cookie-Banner anpassen.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Ihre Rechte</h2>
            <p>
              Sie haben folgende Rechte gemäß der DSGVO:
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-3">4.1 Auskunftsrecht (Art. 15 DSGVO)</h3>
            <p>
              Sie können jederzeit eine Kopie Ihrer bei uns gespeicherten Daten anfordern. 
              Nutzen Sie dazu die Funktion &quot;Datenexport&quot; in Ihren Kontoeinstellungen.
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-3">4.2 Recht auf Berichtigung (Art. 16 DSGVO)</h3>
            <p>
              Sie können Ihre Daten jederzeit in Ihren Kontoeinstellungen aktualisieren.
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-3">4.3 Recht auf Löschung (Art. 17 DSGVO)</h3>
            <p>
              Sie können Ihr Konto jederzeit über die Kontoeinstellungen löschen. 
              Dabei werden Ihre Daten anonymisiert oder gelöscht.
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-3">4.4 Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</h3>
            <p>
              Sie können Ihre Daten in einem maschinenlesbaren Format exportieren.
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-3">4.5 Widerrufsrecht (Art. 7 Abs. 3 DSGVO)</h3>
            <p>
              Sie können Ihre Einwilligungen (z.B. Marketing) jederzeit in den 
              Kontoeinstellungen widerrufen.
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-3">4.6 Beschwerderecht</h3>
            <p>
              Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Datensicherheit</h2>
            <p>
              Wir treffen umfangreiche technische und organisatorische Maßnahmen zum Schutz Ihrer Daten:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>SSL/TLS-Verschlüsselung aller Datenübertragungen</li>
              <li>Sichere Passwort-Hashing mit bcrypt</li>
              <li>Rate Limiting zum Schutz vor Brute-Force-Angriffen</li>
              <li>Regelmäßige Sicherheitsaudits</li>
              <li>Zugriffskontrolle und Audit-Logging</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Speicherdauer</h2>
            <p>
              Wir speichern Ihre Daten nur so lange, wie es für die Erbringung unserer 
              Dienste erforderlich ist oder gesetzliche Aufbewahrungsfristen dies vorsehen.
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Kontodaten: Bis zur Löschung des Kontos</li>
              <li>Rechnungsdaten: 10 Jahre (gesetzliche Aufbewahrungsfrist)</li>
              <li>Aktivitätsprotokolle: 12 Monate</li>
              <li>Gelöschte Konten: Anonymisiert nach 30 Tagen</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. Kontakt</h2>
            <p>
              Bei Fragen zum Datenschutz können Sie uns jederzeit kontaktieren:
            </p>
            <p className="mt-4">
              <strong>E-Mail:</strong> datenschutz@builderly.dev
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
