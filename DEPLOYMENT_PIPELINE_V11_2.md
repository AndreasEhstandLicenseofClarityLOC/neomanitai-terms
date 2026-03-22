# NEOMANITAI V11.2 Deployment Pipeline

## STATUS
- Template: V11_2_MASTER_TEMPLATE.html (APPROVED)
- Target: 1229 term HTML files in this folder (excluding QUARANTINE/)
- License: CC BY-NC-ND 4.0 International
- CRITICAL: Deploy ONLY AFTER Zenodo PDF is uploaded and confirmed

---

## WHAT V11.2 CHANGES vs OLD FILES

### NEW ELEMENTS TO INJECT
1. **Motto Banner** (top): "New words 4 new worlds ❤️💻 Stay human"
2. **WHY-Block**: "Context · Why terminology matters" — 4 points, impersonal
3. **Bilingual Tagline** under term name: 1-2 sentence EN + DE summary
4. **Floating Particles** replacing star field
5. **Upgraded Disclaimer**: §1-§19 (was §1-§18), with:
   - §16 now CC BY-NC-ND 4.0 + Anti-commercial + IP protection + ORCID contact
   - §17 NEW: AI Training Prohibition
   - §19 NEW: Salvatorische Klausel / Severability
6. **Focus States** for keyboard accessibility
7. **Status Bar**: V11.2 date, §1-§19

### CSS CHANGES
- Complete replacement of old `<style>` block with V11.2 CSS
- New animations: meshShift (15s), particles, bannerGlow, borderPulse, taglineGlow
- New classes: .why-block, .why-points, .why-compact, .tagline, .tagline-en, .tagline-de
- Contrast fix: --text-muted raised to #7a7a9a (WCAG AA)
- Focus-visible styles for all interactive elements
- will-change hints for scroll-bar and mesh-bg

### TEXT CHANGES ALREADY APPLIED IN PREVIOUS ROUNDS
- All "Du/You/dein/your" removed (4263+ replacements)
- All psychologist/medical/therapeutic language removed
- All "man lernst" conjugation errors fixed
- Footer: "New words 4 new worlds ❤️💻 Stay human"
- JSON fragment leaks {'en': '...'} fixed in FAQ sections

---

## BATCH DEPLOYMENT SCRIPT (Python)

```python
import os, re

TEMPLATE = 'V11_2_MASTER_TEMPLATE.html'
FOLDER = '.'  # Run from AUG_1000_GITHUB/
SKIP = {'QUARANTINE', 'V11_2_MASTER_TEMPLATE.html', 'DEPLOYMENT_PIPELINE_V11_2.md',
        'CITATION.cff', 'zenodo_metadata.json', 'BEISPIEL_TERM_V11_DESIGN.html',
        'index.html', 'README.md', 'LICENSE'}

# Read template
with open(TEMPLATE, 'r', encoding='utf-8') as f:
    template = f.read()

# Extract CSS from template (everything between <style> and </style>)
css_match = re.search(r'<style>(.*?)</style>', template, re.DOTALL)
NEW_CSS = css_match.group(1) if css_match else ''

# Extract WHY-block HTML
why_match = re.search(r'(<!-- === WHY THIS COMPENDIUM.*?</div>\s*</div>)', template, re.DOTALL)
WHY_BLOCK = why_match.group(1) if why_match else ''

# Extract motto banner
motto_match = re.search(r"(<div class='motto-banner'>.*?</div>)", template, re.DOTALL)
MOTTO = motto_match.group(1) if motto_match else ''

# Extract particles div
PARTICLES = "<div class='particles' id='particles'></div>"

# Extract new disclaimer
disc_match = re.search(r"(<div class='disc-lang active' id='disc-en'>.*?</div>\s*<div class='disc-lang' id='disc-de'>.*?</div>)", template, re.DOTALL)
NEW_DISCLAIMER = disc_match.group(1) if disc_match else ''

# Extract particles JS
particles_js_match = re.search(r'(// Floating particles.*?)(?=</script>)', template, re.DOTALL)
PARTICLES_JS = particles_js_match.group(1) if particles_js_match else ''

count = 0
errors = []

for fname in sorted(os.listdir(FOLDER)):
    if not fname.endswith('.html') or fname in SKIP:
        continue
    fpath = os.path.join(FOLDER, fname)

    try:
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()

        # 1. Replace CSS
        content = re.sub(r'<style>.*?</style>', f'<style>{NEW_CSS}</style>', content, count=1, flags=re.DOTALL)

        # 2. Insert motto banner after <div class='container'>
        if "motto-banner" not in content:
            content = content.replace("<div class='container'>",
                f"<div class='container'>\n\n    {MOTTO}\n")

        # 3. Insert WHY-block after motto banner (if not already present)
        if "why-block" not in content:
            content = content.replace("</div>\n\n    <!-- === STATUS",
                f"</div>\n\n    {WHY_BLOCK}\n\n    <!-- === STATUS")

        # 4. Insert particles div
        if "particles" not in content:
            content = content.replace("<div class='scroll-bar'",
                f"{PARTICLES}\n  <div class='scroll-bar'")

        # 5. Replace star field with particles
        content = re.sub(r"<div class='star-field'.*?</div>", '', content, flags=re.DOTALL)

        # 6. Replace old disclaimer with new
        content = re.sub(
            r"<div class='disc-lang active' id='disc-en'>.*?</div>\s*<div class='disc-lang' id='disc-de'>.*?</div>",
            NEW_DISCLAIMER, content, flags=re.DOTALL)

        # 7. Update license references
        content = content.replace('CC BY-ND 4.0', 'CC BY-NC-ND 4.0')

        # 8. Update version
        content = content.replace('V11.0', 'V11.2')
        content = content.replace('V10.', 'V11.2 ·')  # catch old versions

        # 9. Add tagline if extractable from definition
        # (This requires per-file logic - see TAGLINE GENERATION below)

        # 10. Insert particles JS before </script>
        if 'Floating particles' not in content:
            content = content.replace('</script>\n</body>',
                f'{PARTICLES_JS}</script>\n</body>')

        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content)
        count += 1

    except Exception as e:
        errors.append(f"{fname}: {e}")

print(f"Updated {count} files")
if errors:
    print(f"Errors ({len(errors)}):")
    for e in errors:
        print(f"  {e}")
```

---

## TAGLINE GENERATION

Each term needs a bilingual tagline (1-2 sentences). Two approaches:

### Approach A: Extract from existing definition
- Take first sentence of EN definition, truncate to ~120 chars
- Take first sentence of DE definition, truncate to ~120 chars
- Wrap in `<div class='tagline'>...</div>`

### Approach B: Generate fresh (recommended for quality)
- Run through Claude in batches of 50 terms
- Input: term name + full definition
- Output: 1-sentence EN tagline + 1-sentence DE tagline
- Rules: NO Du/You, NO psycho-language, NO imperatives

---

## LANGUAGE RULES (HARD CONSTRAINTS for all content)

1. NEVER: du, you, dein, your, dich, dir, euch, ihr, Sie
2. NEVER: psychologist, therapist, therapeutic, cognitive, neural, subconscious,
   nervous system, attachment, bonding, coping, well-being, mindful, self-care
3. NEVER: imperatives (try, discover, learn, explore your, find out, test)
4. NEVER: marketing (revolutionary, groundbreaking, game-changing, unique, best)
5. ALWAYS: impersonal (man, users, one, Nutzende, third person)
6. ALWAYS: descriptive, not normative
7. ALWAYS: ISO 704/1087/30042 INSPIRED (never "compliant" or "konform")
8. ALWAYS: CC BY-NC-ND 4.0 (never just CC BY-ND)

---

## SECURITY FILTERS (run before ANY deployment)

1. PII: No school name, address, medications, family data
2. UG connection: No Leomanitai, no pricing, no commercial links
3. Time claims: No "first ever", "until now", "world's first"
4. Biography: No sport, teacher, coach, trainer, Bundesliga, court
5. Tonality: Max 1 superlative per page
6. Numbers: No internal counts (87000, 580, 40000)
7. Methodology: No SSP, RKE, LOS, skill system references
8. Connotation: No pathologizing language
9. Metadata: No debug comments, no internal TODOs
10. Links: Only ORCID, Google Fonts, creativecommons.org

---

## QUARANTINE FOLDER

53 files quarantined — DO NOT deploy these:
- Negative connotation terms (e.g., chosen-one, betray-fear, jealous-emerge)
- Empty placeholders (body-var-6 through body-var-25, bond-a through bond-h)
- These need individual review before potential release

---

## POST-DEPLOYMENT CHECKLIST

1. [ ] Zenodo PDF uploaded and DOI confirmed
2. [ ] Batch script executed successfully
3. [ ] Spot-check 10 random terms (mobile + desktop)
4. [ ] Security scan on 10 random terms
5. [ ] Landing page (index.html) created
6. [ ] GitHub Pages verified live
7. [ ] README.md updated
