# Flying Toaster API

## Verfuegbare Endpunkte

### Hauptendpunkt
- `GET /api/` - Gibt allgemeine Informationen zur API zurueck.

### Toasts
- `GET /api/toasts` - Gibt alle Toast-Eintraege zurueck.
- `GET /api/toasts?id=1` - Gibt einen bestimmten Toast-Eintrag zurueck.
- `GET /api/toasts?status=lightly toasted` - Filtert Toast-Eintraege nach Status.
- `GET /api/toasts?temperature_min=200&temperature_max=300` - Filtert Toast-Eintraege nach Temperaturbereich.
- `POST /api/toasts` - Speichert einen neuen Toast-Eintrag.
  - Pflichtfelder:
    - `time_minutes` - Zubereitungszeit in Minuten
    - `toasts_amount` - Anzahl der Toasts
    - `temperature` - Zubereitungstemperatur in Grad Celsius
  - Optionales Feld:
    - `status` - Toaststatus (`untoasted`, `lightly toasted`, `strong toasted`, `burnt`)
- `PUT /api/toasts?id=1` - Aktualisiert einen Toast-Eintrag. Erlaubte Felder sind `status`, `time_minutes`, `toasts_amount` und `temperature`.
- `DELETE /api/toasts?id=1` - Loescht einen Toast-Eintrag.

#### Beispiel fuer einen POST-Request
```json
{
  "status": "lightly toasted",
  "time_minutes": 7,
  "toasts_amount": 2,
  "temperature": 230
}
```

#### Beispielantwort
```json
{
  "id": 12,
  "message": "Toast usage recorded successfully"
}
```

#### Beispiel mit curl
```bash
curl -X POST "/api/toasts" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "lightly toasted",
    "time_minutes": 7,
    "toasts_amount": 2,
    "temperature": 230
  }'
```

#### Beispiel mit JavaScript
```js
fetch('/api/toasts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    status: 'lightly toasted',
    time_minutes: 7,
    toasts_amount: 2,
    temperature: 230
  })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

#### Felder eines Toast-Eintrags
- `id` - eindeutige ID des Eintrags
- `status` - Toaststatus
- `time_minutes` - Zubereitungszeit in Minuten
- `toasts_amount` - Anzahl der Toasts
- `temperature` - Zubereitungstemperatur in Grad Celsius

### Einstellungen
- `GET /api/settings` - Gibt alle Einstellungen zurueck.
- `GET /api/settings?key=theme` - Gibt eine bestimmte Einstellung zurueck.
- `POST /api/settings` - Erstellt oder aktualisiert eine Einstellung.
- `DELETE /api/settings?key=theme` - Loescht eine Einstellung.

### Statistik
- `GET /api/stats` - Gibt die Statistik zurueck.
- `POST /api/stats` - Aktualisiert die Statistik.
