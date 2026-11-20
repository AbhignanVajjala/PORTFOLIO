"""Regression checks for missing evidence, source corruption and scenario parsing."""

import tempfile
from pathlib import Path
import unittest
from unittest.mock import patch

from reproducibility import analyze


class ResearchAuditTests(unittest.TestCase):
    def test_missing_source_is_excluded_from_weight_denominator(self):
        self.assertAlmostEqual(
            analyze.priority({"AFS": "0.6", "PS": "", "SS": "0.9"}, (0.5, 0.3, 0.2)),
            0.48 / 0.7,
        )

    def test_nonfinite_and_missing_scores_fail(self):
        for row in (
            {"AFS": "nan", "PS": "", "SS": ""},
            {source: "" for source in analyze.SOURCES},
        ):
            with self.assertRaises(ValueError):
                analyze.priority(row, analyze.WEIGHTS[0])

    def test_ties_use_average_ranks_for_correlation(self):
        self.assertEqual(analyze.ranks([0.8, 0.8, 0.2], average=True), [1.5, 1.5, 3])
        self.assertAlmostEqual(analyze.spearman([0.8, 0.8, 0.2], [4, 4, 1]), 1)

    def test_tampered_source_fails_before_analysis(self):
        with tempfile.TemporaryDirectory() as temporary:
            (Path(temporary) / "exo-scores.csv").write_text("changed")
            with patch.object(analyze, "INPUTS", Path(temporary)):
                with self.assertRaisesRegex(ValueError, "Input checksum mismatch"):
                    analyze.collect_results()

    def test_tag_relative_change_depends_on_demand(self):
        text = (analyze.INPUTS / "cyanobacteria-output.txt").read_text(encoding="utf-8")
        rows = analyze.parse_tag(text)
        self.assertAlmostEqual(rows[4]["gainPercent"], 7.956599142364595)
        self.assertGreater(rows[5]["gainPercent"], rows[4]["gainPercent"])
        self.assertIsNone(rows[-1]["gainPercent"])
        with self.assertRaisesRegex(ValueError, "TAG absolute difference mismatch"):
            analyze.parse_tag(
                text.replace("0.0015809143672693704", "0.0055809143672693704")
            )

    def test_reported_growth_sweep_is_required(self):
        text = (analyze.INPUTS / "ecoli-output.txt").read_text(encoding="utf-8")
        rows = analyze.parse_ecoli(text)
        self.assertEqual(len(rows["sweep"]), 8)
        self.assertAlmostEqual(rows["endpoints"]["reference"], 0.024752978124691682)
        with self.assertRaisesRegex(ValueError, "Incomplete growth requirement sweep"):
            analyze.parse_ecoli(text.replace("8.652630e-02", "missing"))


if __name__ == "__main__":
    unittest.main()
