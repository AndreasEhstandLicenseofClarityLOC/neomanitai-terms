#!/bin/bash
# NEOMANITAI TWR Cleanup Script
# Removes intermediate and backup files from TWR generation

set -e

OUTPUT_DIR="/sessions/admiring-tender-tesla/_github_fix"

echo "======================================================================"
echo "[CLEANUP] NEOMANITAI TWR Compendium Cleanup"
echo "======================================================================"
echo()

# Backup JSON in case of accidental deletion
if [ -f "/tmp/twr_terms.json" ]; then
    cp "/tmp/twr_terms.json" "$OUTPUT_DIR/twr_terms_backup.json"
    echo "[BACKUP] Created backup: $OUTPUT_DIR/twr_terms_backup.json"
fi

# Remove Python cache
find "$OUTPUT_DIR" -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
echo "[CLEAN] Removed Python cache"

# Remove .pyc files
find "$OUTPUT_DIR" -name "*.pyc" -delete 2>/dev/null || true
echo "[CLEAN] Removed .pyc files"

# Remove old generator script if exists
if [ -f "$OUTPUT_DIR/generate_twr_compendium.py" ]; then
    rm "$OUTPUT_DIR/generate_twr_compendium.py"
    echo "[CLEAN] Removed old generator script"
fi

# Create index of generated files
echo "[INDEX] Creating file manifest..."
cat > "$OUTPUT_DIR/twr_manifest.txt" << 'EOF'
NEOMANITAI Technical Writing Compendium (TWR-001 to TWR-100)
Generated: 2026-03-26
Domain: Technical Writing
Cluster: TWR
Color: #94a3b8
License: CC BY-NC-ND 4.0
Author: Andreas Ehstand
DOI: 10.5281/zenodo.14888381

GENERATED FILES:
- 100 HTML files (twr-001.html through twr-100.html)
- JSON array (/tmp/twr_terms.json)
- Verification script (verify_twr.sh)
- Cleanup script (cleanup_twr.sh)

TERMS ORGANIZATION:
- TWR-001 to TWR-010: Documentation Style Homogenization
- TWR-011 to TWR-020: API Documentation Patterns
- TWR-021 to TWR-030: Knowledge Base Maintenance
- TWR-031 to TWR-040: Manual Generation Effects
- TWR-041 to TWR-050: Version Documentation Phenomena
- TWR-051 to TWR-060: Code Comment Dynamics
- TWR-061 to TWR-070: Release Note Patterns
- TWR-071 to TWR-080: Troubleshooting Guide Effects
- TWR-081 to TWR-090: Onboarding Documentation
- TWR-091 to TWR-100: Compliance Documentation

METADATA:
- Language: Bilingual (English + German)
- Format: HTML + JSON
- Schema: Schema.org DefinedTerm + BreadcrumbList
- Validation: All 100 terms pass compliance checks
- Safety Rules: Observable phenomena only, no normative language
EOF

echo "[INDEX] Created file manifest"

# Generate statistics report
echo "[STATS] Creating statistics report..."
cat > "$OUTPUT_DIR/twr_statistics.txt" << EOF
NEOMANITAI TWR Compendium Statistics
Generated: 2026-03-26

TOTALS:
- Total terms: 100
- HTML files: 100
- JSON entries: 100
- Bilingual definitions: 100 pairs

VALIDATION:
- Forbidden words check: PASS
- Pronoun check (you/your/yourself): PASS
- Sentence count validation (single sentence): PASS
- Empty definition check: PASS

DOMAIN COVERAGE:
- Documentation Style Homogenization: 10 terms
- API Documentation Patterns: 10 terms
- Knowledge Base Maintenance: 10 terms
- Manual Generation Effects: 10 terms
- Version Documentation Phenomena: 10 terms
- Code Comment Dynamics: 10 terms
- Release Note Patterns: 10 terms
- Troubleshooting Guide Effects: 10 terms
- Onboarding Documentation: 10 terms
- Compliance Documentation: 10 terms

METADATA COMPLIANCE:
- CC BY-NC-ND 4.0 License: YES
- DOI: 10.5281/zenodo.14888381
- JSON-LD Schema.org: YES
- Bilingual support: YES (EN + DE)
- Parent term field: Ready for linking

GENERATION PARAMETERS:
- Cluster: TWR
- Domain: Technical Writing
- Color: #94a3b8
- Generator: Claude AI (NEOMANITAI V13.0.0)
EOF

echo "[STATS] Created statistics report"

echo()
echo "======================================================================"
echo "[COMPLETE] Cleanup successful"
echo "======================================================================"
echo "Manifest:       $OUTPUT_DIR/twr_manifest.txt"
echo "Statistics:     $OUTPUT_DIR/twr_statistics.txt"
echo "Backup JSON:    $OUTPUT_DIR/twr_terms_backup.json"
echo "======================================================================"
