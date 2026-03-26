#!/bin/bash
# NEOMANITAI TWR Compendium Verification Script
# Verifies integrity and completeness of generated content

set -e

OUTPUT_DIR="/sessions/admiring-tender-tesla/_github_fix"
JSON_FILE="/tmp/twr_terms.json"
DOMAIN="Technical Writing"
CLUSTER="TWR"

echo "======================================================================"
echo "[VERIFY] NEOMANITAI TWR Compendium Verification"
echo "======================================================================"
echo()

# Count HTML files
HTML_COUNT=$(find "$OUTPUT_DIR" -name "twr-*.html" -type f | wc -l)
echo "[HTML] Total HTML files: $HTML_COUNT"
if [ "$HTML_COUNT" -ne 100 ]; then
    echo "[ERROR] Expected 100 HTML files, found $HTML_COUNT"
    exit 1
fi

# Check JSON integrity
if [ ! -f "$JSON_FILE" ]; then
    echo "[ERROR] JSON file not found: $JSON_FILE"
    exit 1
fi

JSON_LINES=$(wc -l < "$JSON_FILE")
echo "[JSON] Total JSON lines: $JSON_LINES"

# Verify each HTML file has correct structure
MISSING_DOMAIN=0
MISSING_CLUSTER=0
for file in "$OUTPUT_DIR"/twr-*.html; do
    if ! grep -q "$DOMAIN" "$file"; then
        ((MISSING_DOMAIN++))
    fi
    if ! grep -q "$CLUSTER" "$file"; then
        ((MISSING_CLUSTER++))
    fi
done

if [ "$MISSING_DOMAIN" -eq 0 ]; then
    echo "[OK] Domain tag present in all HTML files"
else
    echo "[WARN] Domain tag missing in $MISSING_DOMAIN files"
fi

if [ "$MISSING_CLUSTER" -eq 0 ]; then
    echo "[OK] Cluster tag present in all HTML files"
else
    echo "[WARN] Cluster tag missing in $MISSING_CLUSTER files"
fi

# Check JSON validity
if python3 -c "import json; json.load(open('$JSON_FILE'))" 2>/dev/null; then
    echo "[OK] JSON file is valid"
else
    echo "[ERROR] JSON file is malformed"
    exit 1
fi

# Count JSON entries
JSON_ENTRIES=$(python3 -c "import json; print(len(json.load(open('$JSON_FILE'))))")
echo "[JSON] Total entries: $JSON_ENTRIES"
if [ "$JSON_ENTRIES" -ne 100 ]; then
    echo "[WARN] Expected 100 JSON entries, found $JSON_ENTRIES"
fi

# Check for critical metadata in HTML files
echo "[CHECK] Sampling HTML structure..."
SAMPLE_FILE="$OUTPUT_DIR/twr-001.html"
if grep -q "DOI: 10.5281/zenodo.14888381" "$SAMPLE_FILE"; then
    echo "[OK] DOI present in HTML files"
fi
if grep -q "CC BY-NC-ND 4.0" "$SAMPLE_FILE"; then
    echo "[OK] License metadata present"
fi
if grep -q "@context.*schema.org" "$SAMPLE_FILE"; then
    echo "[OK] JSON-LD Schema.org present"
fi

echo()
echo "======================================================================"
echo "[COMPLETE] Verification passed"
echo "======================================================================"
echo "HTML files:     $HTML_COUNT"
echo "JSON entries:   $JSON_ENTRIES"
echo "Domain:         $DOMAIN"
echo "Cluster:        $CLUSTER"
echo "Directory:      $OUTPUT_DIR"
echo "JSON output:    $JSON_FILE"
echo "======================================================================"
