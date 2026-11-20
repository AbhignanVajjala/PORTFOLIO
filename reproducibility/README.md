# Research evidence reanalysis

This directory verifies preserved project outputs and regenerates the figures shown in the portfolio. The original repositories are read-only sources for this work. Their exact commits, paths and SHA-256 hashes are in [sources.json](sources.json). Inputs preserve Git object bytes, including line endings and fixed-width padding. `.gitattributes` retains this source formatting while authored code keeps normal whitespace checks.

## Run

The numerical audit uses Python's standard library. Run it from the repository root after checkout.

```bash
python reproducibility/analyze.py --check
python -m unittest discover -s tests -p "test_*.py"
```

To regenerate the four research figures, three project sharing previews and `src/research-results.json`, use an isolated Python environment with the pinned rendering dependencies.

```bash
python -m venv .venv
# Activate .venv using your shell's activation command.
python -m pip install -r reproducibility/requirements.txt
python reproducibility/analyze.py
python reproducibility/analyze.py --check
```

Executed here with Python 3.14.8, Matplotlib 3.11.2 and NumPy 2.5.4. The plotting environment is separate from the unavailable original metabolic-modeling environment. The web build uses the committed results and PNG files and needs no Python runtime.

## EXO-TARGET

The source snapshot is TNBC-PROJECT `d7ac62df14a6426524807a9396e8de1211790a1d`. The audit performs the following calculations.

- Recompute AFS from the supplied normalized features using 0.50 ipTM, 0.20 pTM, 0.15 inverted interface PAE and 0.15 mean pLDDT. Raw structure prediction and feature normalization are upstream of this audit.
- Recompute TPS as the equally weighted mean of available AFS, PRODIGY and STRING scores. Missing scores stay absent. Maximum absolute TPS discrepancy is approximately 1.11 × 10⁻¹⁶, below the audit tolerance of 10⁻¹².
- Check 20 receptors with five Group A and five Group B candidates per receptor, 21 distinct candidate proteins, and 200 unique receptor–candidate keys. This is a manually selected panel seeded by ExoCarta and extracellular/adhesion/accessibility considerations. The per-pair selection literature trail is incomplete.
- Check coverage of one, two and three evidence scores for 24, 137 and 39 pairs. Filter coverage ≥2 and feasibility High/Medium to recover the ordered 121-pair shortlist.
- Recompute all five recorded weight schemes and compare with the stored sensitivity CSV. The four alternatives have Spearman correlations of 0.945456, 0.939761, 0.988186 and 0.991298 with equal weights. Their top-ten overlaps are 9, 7, 10 and 10. Rankings use all 200 pairs, and shortlist ranks use the filtered 121 pairs. Ties receive minimum rank for ordering and average rank for Spearman correlation.
- Render the exact `T13_THBS1` unrelaxed AlphaFold2-Multimer PDB mapped in the backend structure index. Chain A contains 248 Cα atoms and chain B contains 1,152. This is a trace of modeled sequences, with coordinates in Å. It supplies no experimental binding or interface-validation evidence.

No reference-label benchmark, AUROC, AUPRC or bootstrap accuracy estimate was calculated. The source panel has no independently curated assay labels. Group A/B describes candidate selection, and missing STRING evidence cannot define negatives. An evaluation would need experimental physical-interaction records matched by species, accession, isoform/domain and assay, documented non-interactions where available, and accounting for reference evidence already used by STRING. Artificial shuffled pairs would require separate labeling and cannot establish biological predictive accuracy. [IntAct curation guidance](https://raw.githubusercontent.com/intact-portal/intact-portal-documentation/master/assets/intact-curation-manual.pdf)

The source has historical inconsistencies. Earlier scripts and methodology passages mark feasibility as pending, while the final tables contain UniProt-derived flags. This audit checks the frozen final tables and their filter directly. A narrative claim that TPI1 has the highest AFS is also contradicted by the table, whose maximum is ANXA2 at 0.9638585385. The portfolio retains the narrower observation that high structural confidence can occur for candidates with low surface feasibility. No source research file was modified.

## FLUXNOVA

The source snapshot is Metaforge `f47186650e187899949e373216795cc90b54dd68`. Its tracked files and the authorized portfolio workspace were inspected for Python/Colab notebooks, SBML/XML/MAT model files, environment specifications and solver settings. Only the console outputs, frontend datasets and provenance notes support the metabolic results here.

| Application | Conditions recoverable from the record | Reanalysis performed |
| --- | --- | --- |
| iRH783, Synechocystis sp. PCC 6803 | Nine forward-only DAGK corrections, proposed TES160/FADD160/ATFA160/DM_TAG160 route, selected light 400 µmol photons m⁻² s⁻¹, reference versus zero glycogen allocation at matched non-glycogen biomass demand | Extract nine reported demands from 0–100%, verify absolute and percentage differences, replot the actual points |
| iHK1487, E. coli BL21(DE3) | Reference glucose/oxygen bounds 10/18.5 mmol/gDCW/h, 86-aa precursor, four ATP equivalents per amino acid, fixed or adaptive minimum growth | Extract eight reported reference growth requirements, check molar versus mass-flux units and rounding, verify reference and best endpoints, replot actual points |

The 80% TAG comparison is 0.019869222251650897 versus 0.021450136618920267 model flux units, or 7.9565991424%. The absolute demand is 0.08131587936437869. The relative differences at 20% and 90% demand are 0.4972874464% and 17.9023480703%. At 100%, the reference is near machine zero and the source percentage is undefined. The figure plots reported points without interpolated solver predictions. Both scenarios include the TAG extension. A separate GLGC-only control in the source shows no benefit.

The proinsulin reference, fixed-growth best and adaptive-growth best are 0.024752978124691682, 0.050104900417283646 and 0.029960116004179933 mmol/gDCW/h. Both best scenarios use 1.2× glucose and oxygen uptake limits. Fixed minimum growth is 0.6559959324744352 h⁻¹. Adaptive growth is 80% of the selected nutrient scenario's maximum and reaches 0.7939939241331285 h⁻¹ at the enriched condition.

The original solver calculations were **not reproduced**. Fresh FBA, biomass-threshold sensitivity, FVA and a new growth–production envelope were **not executed**. The existing transcripts include FVA and growth trade-off results, but their presence cannot establish a rerun. Missing inputs include exact model files/versions/checksums, original modification code and notebooks, full media, adapted light-constraint code, Python/COBRApy and solver versions, solver initialization and tolerances. These fields remain unknown. No substitute model or hypothetical solver environment was presented as the original. The source's model IDs alone cannot recover the analyses. Experimental product titers, biodiesel yield, mature insulin production and validated engineering interventions remain unestablished.

## Bioinformatics Agent Skills

The reviewed source is `98a9456132fb474996f4c5d566065925ed79551b`, documentation release 0.2.2. Its public code, synthetic fixtures, scientific evidence reports and Phase 2 agent-pilot review support inclusion as experimental research software. The review records ten completed turns with provisional 0 PASS, 4 FAIL and 6 BLOCKED, unverified activation and one response per condition. No new agent evaluation or biological-data analysis was run for this portfolio update. Independent human review remains pending. Maintainer attribution follows the source's AI-assistance disclosure.

## Updating evidence

Replace a snapshot only after reviewing its source commit, update its hash and provenance in `sources.json`, regenerate, and review the resulting numerical differences and figures. The audit fails on changed input bytes, missing records, inconsistent scores, stale generated JSON, invalid arithmetic or nonfinite required values. It does not infer biological correctness from internally consistent tables.
