#!/usr/bin/env python3
"""Turn Claude's JSON result into a PR comment (review.md) and a gate signal.

Reads review-output.json (written by run-review.sh), writes review.md, and
exposes high_count as a step output when running in GitHub Actions.
"""
import json
import os
import sys
from pathlib import Path

SEVERITY_ORDER = ("high", "medium", "low")
ICONS = {"high": "🔴", "medium": "🟠", "low": "🟡"}


def render(result):
    review = result["structured_output"]
    findings = sorted(review["findings"], key=lambda f: SEVERITY_ORDER.index(f["severity"]))
    counts = {s: sum(1 for f in findings if f["severity"] == s) for s in SEVERITY_ORDER}

    lines = ["## Claude review", "", review["summary"], ""]

    if findings:
        tally = " · ".join(f"{ICONS[s]} {counts[s]} {s}" for s in SEVERITY_ORDER if counts[s])
        lines += [f"**{len(findings)} finding(s):** {tally}", ""]
        for f in findings:
            where = f["file"] if f["line"] is None else f"{f['file']}:{f['line']}"
            lines += [
                f"### {ICONS[f['severity']]} {f['severity']} · {f['category']} · `{where}`",
                f["issue"],
                "",
                f"- **Failure scenario:** {f['failure_scenario']}",
                f"- **Suggestion:** {f['suggestion']}",
                "",
            ]
    else:
        lines += ["No findings that meet the review criteria.", ""]

    model = ", ".join(result.get("modelUsage", {})) or "unknown model"
    gate = f"blocking: {counts['high']} high" if counts["high"] else "no blocking findings"
    lines.append(f"<sub>{model} · ${result.get('total_cost_usd', 0):.4f} · {gate}</sub>")
    return "\n".join(lines) + "\n", counts["high"]


def main(src="review-output.json", dest="review.md"):
    result = json.loads(Path(src).read_text(encoding="utf-8"))

    if result.get("is_error") or result.get("structured_output") is None:
        sys.exit(
            "Claude did not return a valid structured review "
            f"(subtype={result.get('subtype')}, stop_reason={result.get('stop_reason')}): "
            f"{str(result.get('result'))[:500]}"
        )

    markdown, high_count = render(result)
    Path(dest).write_text(markdown, encoding="utf-8")

    github_output = os.environ.get("GITHUB_OUTPUT")
    if github_output:
        with open(github_output, "a", encoding="utf-8") as fh:
            fh.write(f"high_count={high_count}\n")

    print(f"Wrote {dest}: {len(result['structured_output']['findings'])} finding(s), {high_count} high.")


if __name__ == "__main__":
    main(*sys.argv[1:])
