"""Audit preserved project tables and regenerate portfolio figures.

This reanalysis uses frozen outputs. It does not run AlphaFold, PRODIGY or COBRApy.
Run from any directory with Python 3.14: python reproducibility/analyze.py
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import math
from pathlib import Path
import re
import statistics

ROOT = Path(__file__).resolve().parents[1]
INPUTS = ROOT / "reproducibility" / "inputs"
RESULTS = ROOT / "src" / "research-results.json"
FIGURES = ROOT / "public" / "figures"
SOURCES = ("AFS", "PS", "SS")
WEIGHTS = [
    (1 / 3, 1 / 3, 1 / 3),
    (0.5, 0.3, 0.2),
    (0.5, 0.2, 0.3),
    (0.4, 0.35, 0.25),
    (0.4, 0.3, 0.3),
]
NUMBER = r"[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?"
TOLERANCE = 1e-12


def require(condition, message):
    if not condition:
        raise ValueError(message)


def read_csv(name):
    with (INPUTS / name).open(encoding="utf-8-sig", newline="") as handle:
        return list(csv.DictReader(handle))


def pair_key(row):
    return (row["Target No."], row["Protein"])


def priority(row, weights):
    available = [
        (float(row[source]), weight)
        for source, weight in zip(SOURCES, weights)
        if row[source] != ""
    ]
    require(bool(available), "A pair has no evidence scores")
    require(
        all(math.isfinite(value) and 0 <= value <= 1 for value, _ in available),
        "Invalid evidence score",
    )
    return sum(value * weight for value, weight in available) / sum(
        weight for _, weight in available
    )


def ranks(values, *, average=False):
    """Descending ranks. Use minimum rank for ordering, average ties for Spearman."""
    order = sorted(range(len(values)), key=lambda index: -values[index])
    result = [0.0] * len(values)
    start = 0
    while start < len(order):
        stop = start + 1
        while stop < len(order) and values[order[stop]] == values[order[start]]:
            stop += 1
        rank = (start + 1 + stop) / 2 if average else start + 1
        for index in order[start:stop]:
            result[index] = rank
        start = stop
    return result


def spearman(left, right):
    x, y = ranks(left, average=True), ranks(right, average=True)
    mx, my = statistics.mean(x), statistics.mean(y)
    denominator = math.sqrt(
        sum((value - mx) ** 2 for value in x) * sum((value - my) ** 2 for value in y)
    )
    require(denominator > 0, "Rank correlation requires nonconstant inputs")
    return sum((a - mx) * (b - my) for a, b in zip(x, y)) / denominator


def audit_exo():
    rows = read_csv("exo-scores.csv")
    shortlist = read_csv("exo-shortlist.csv")
    afs = {pair_key(row): row for row in read_csv("exo-afs.csv")}
    saved_sensitivity = {pair_key(row): row for row in read_csv("exo-sensitivity.csv")}
    require(
        len(rows) == 200 and len({pair_key(row) for row in rows}) == 200,
        "Expected 200 distinct pairs",
    )
    receptors = {row["Target No."] for row in rows}
    require(len(receptors) == 20, "Expected 20 receptors")
    for receptor in receptors:
        group = [row for row in rows if row["Target No."] == receptor]
        require(
            sorted(int(row["Group"]) for row in group) == list(range(1, 11)),
            "Expected five A and five B candidates per receptor",
        )
    error = []
    for row in rows:
        key = pair_key(row)
        expected_afs = sum(
            float(afs[key][feature]) * weight
            for feature, weight in [
                ("ipTM_N", 0.5),
                ("pTM_N", 0.2),
                ("interface_PAE_N", 0.15),
                ("mean_pLDDT_N", 0.15),
            ]
        )
        require(
            abs(expected_afs - float(row["AFS"])) < TOLERANCE, "AFS formula mismatch"
        )
        error.append(abs(priority(row, WEIGHTS[0]) - float(row["TPS"])))
        require(
            row["Coverage"] == f"{sum(row[source] != '' for source in SOURCES)}/3",
            "Evidence coverage mismatch",
        )
        require(
            row["BS_flag"] in ("High", "Medium", "Low"), "Unresolved feasibility flag"
        )
        require(
            row["Group_AB"] == ("A" if int(row["Group"]) <= 5 else "B"),
            "Candidate group mismatch",
        )
    require(max(error) < TOLERANCE, "TPS formula mismatch")
    expected = [
        row for row in rows if row["Coverage"] != "1/3" and row["BS_flag"] != "Low"
    ]
    expected.sort(key=lambda row: (-float(row["TPS"]), -int(row["Coverage"][0])))
    require(
        [pair_key(row) for row in expected] == [pair_key(row) for row in shortlist],
        "Shortlist membership or order mismatch",
    )
    for source_row, shortlist_row in zip(expected, shortlist):
        for column in (*SOURCES, "TPS", "Coverage", "BS_flag"):
            require(
                source_row[column] == shortlist_row[column], "Shortlist score mismatch"
            )

    scores = [[priority(row, weights) for row in rows] for weights in WEIGHTS]
    rank_columns = [ranks(column) for column in scores]
    sensitivity_columns = list(next(iter(saved_sensitivity.values())))[2:]
    for index, row in enumerate(rows):
        for column, name in zip(scores, sensitivity_columns):
            require(
                abs(column[index] - float(saved_sensitivity[pair_key(row)][name]))
                < TOLERANCE,
                "Stored sensitivity mismatch",
            )
    top = set(sorted(range(len(rows)), key=lambda i: -scores[0][i])[:10])
    comparisons = []
    for scheme, column in enumerate(scores[1:], 1):
        comparison = set(sorted(range(len(rows)), key=lambda i: -column[i])[:10])
        comparisons.append(
            {
                "weights": list(WEIGHTS[scheme]),
                "spearman": spearman(scores[0], column),
                "top10Overlap": len(top & comparison),
            }
        )
    selected = (
        shortlist[:5]
        + [row for row in shortlist if row["Robustness_tier"] == "Tier1"][:3]
    )
    indices = {pair_key(row): index for index, row in enumerate(rows)}
    selections = [
        {
            "receptor": row["Receptor"],
            "protein": row["Protein"],
            "shortlistRank": int(row["Rank"]),
            "score": float(row["TPS"]),
            "coverage": row["Coverage"],
            "feasibility": row["BS_flag"],
            "ranks": [column[indices[pair_key(row)]] for column in rank_columns],
        }
        for row in selected
    ]
    return {
        "pairs": len(rows),
        "receptors": len(receptors),
        "proteins": len({row["Protein"] for row in rows}),
        "coverage": {
            coverage: sum(row["Coverage"] == coverage for row in rows)
            for coverage in ("1/3", "2/3", "3/3")
        },
        "sourceCounts": {
            source: sum(row[source] != "" for row in rows) for source in SOURCES
        },
        "shortlist": len(shortlist),
        "maxScoreError": max(error),
        "weightComparisons": comparisons,
        "selected": selections,
        "benchmarkStatus": "No independent assay labels or negative reference set",
    }


def parse_tag(text):
    section = text.split("GLYCOGEN VS TAG CARBON-REDIRECTION TEST:", 1)[1].split(
        "GLYCOGEN STORAGE SENSITIVITY", 1
    )[0]
    pattern = rf"Biomass demand: ({NUMBER}) % \| Absolute: ({NUMBER})\s+WT glycogen storage: ({NUMBER})\s+WT TAG: ({NUMBER}) \| GLGC-KO TAG: ({NUMBER})\s+Absolute TAG gain: ({NUMBER}) \| Percent gain: ({NUMBER}|nan) %"
    data = []
    for match in re.finditer(pattern, section):
        threshold, biomass, storage, reference, released, gain = map(
            float, match.groups()[:6]
        )
        require(
            all(
                math.isfinite(value)
                for value in (threshold, biomass, storage, reference, released, gain)
            ),
            "Nonfinite TAG data",
        )
        require(
            abs(released - reference - gain) < TOLERANCE,
            "TAG absolute difference mismatch",
        )
        percent = None if match[7] == "nan" else float(match[7])
        if percent is not None:
            require(
                reference > TOLERANCE and abs(100 * gain / reference - percent) < 1e-8,
                "TAG relative difference mismatch",
            )
        else:
            require(
                abs(reference) < TOLERANCE,
                "Undefined percent needs a near-zero reference",
            )
        data.append(
            {
                "threshold": threshold,
                "biomass": biomass,
                "glycogen": storage,
                "reference": reference,
                "released": released,
                "gainPercent": percent,
            }
        )
    require(
        [row["threshold"] for row in data] == [0, 20, 40, 60, 80, 90, 95, 99, 100],
        "Incomplete TAG comparison",
    )
    return data


def parse_ecoli(text):
    section = text.split("Growth requirement (%)", 1)[1].split("GROWTH:", 1)[0]
    pattern = rf"^\s*({NUMBER})\s+({NUMBER})\s+({NUMBER})\s+({NUMBER})\s+optimal\s*$"
    sweep = []
    for match in re.finditer(pattern, section, re.MULTILINE):
        threshold, growth, flux, mass = map(float, match.groups())
        require(
            all(
                math.isfinite(value) and value >= 0
                for value in (threshold, growth, flux, mass)
            ),
            "Invalid growth-sweep value",
        )
        require(
            math.isclose(mass, flux * 9391.55414 / 1000, rel_tol=1e-6, abs_tol=1e-8),
            "Molar and mass flux mismatch",
        )
        sweep.append({"threshold": threshold, "growth": growth, "flux": flux})
    require(
        [row["threshold"] for row in sweep] == [20, 40, 60, 70, 80, 90, 95, 100],
        "Incomplete growth requirement sweep",
    )
    final = text.split("===== FINAL METAFORGE RESULTS =====", 1)[1]
    endpoints = {}
    for key, label in [
        ("reference", "Reference proinsulin"),
        ("fixed", "Best fixed-growth proinsulin"),
        ("adaptive", "Best adaptive-growth proinsulin"),
    ]:
        match = re.search(rf"{label}: ({NUMBER})", final)
        require(match is not None, f"Missing {label}")
        endpoints[key] = float(match[1])
        require(
            math.isfinite(endpoints[key]) and endpoints[key] > 0,
            "Invalid proinsulin flux",
        )
    require(
        abs(
            next(row["flux"] for row in sweep if row["threshold"] == 80)
            - endpoints["reference"]
        )
        < 5e-9,
        "Rounded growth-sweep reference mismatch",
    )
    return {"sweep": sweep, "endpoints": endpoints}


def structure_coordinates():
    index = next(
        row
        for row in read_csv("exo-structure-index.csv")
        if row["interaction_id"] == "T13_THBS1"
    )
    require(
        index["receptor"] == "CD44" and index["protein"] == "THBS1",
        "Structure identity mismatch",
    )
    chains = {"A": [], "B": []}
    for line in (
        (INPUTS / "exo-cd44-thbs1.pdb").read_text(encoding="utf-8").splitlines()
    ):
        if line.startswith("ATOM  ") and line[12:16].strip() == "CA":
            require(line[21] in chains, "Unexpected structure chain")
            chains[line[21]].append(
                [float(line[30:38]), float(line[38:46]), float(line[46:54])]
            )
    require(all(chains.values()), "Missing receptor or candidate C-alpha coordinates")
    return index, chains


def collect_results():
    manifest = json.loads(
        (ROOT / "reproducibility/sources.json").read_text(encoding="utf-8")
    )
    for name, record in manifest["inputs"].items():
        digest = hashlib.sha256((INPUTS / name).read_bytes()).hexdigest()
        require(digest == record["sha256"], f"Input checksum mismatch: {name}")
    exo = audit_exo()
    tag = parse_tag((INPUTS / "cyanobacteria-output.txt").read_text(encoding="utf-8"))
    ecoli = parse_ecoli((INPUTS / "ecoli-output.txt").read_text(encoding="utf-8"))
    index, chains = structure_coordinates()
    return {
        "sources": manifest["sources"],
        "exo": exo,
        "tag": tag,
        "ecoli": ecoli,
        "structure": {
            "file": index["structure_filename"],
            "method": index["structure_source"],
            "residues": {key: len(value) for key, value in chains.items()},
        },
    }


def plot_figures(data):
    import matplotlib

    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    from matplotlib.colors import LinearSegmentedColormap
    import numpy as np

    plt.rcParams.update(
        {
            "font.family": "DejaVu Sans",
            "font.size": 12,
            "text.color": "#d9eaed",
            "axes.labelcolor": "#d9eaed",
            "xtick.color": "#bdd2d9",
            "ytick.color": "#bdd2d9",
            "axes.edgecolor": "#42616f",
            "axes.facecolor": "#102633",
            "figure.facecolor": "#102633",
            "savefig.facecolor": "#102633",
            "axes.spines.top": False,
            "axes.spines.right": False,
        }
    )
    FIGURES.mkdir(parents=True, exist_ok=True)

    def save(figure, name):
        figure.savefig(
            FIGURES / name,
            dpi=160,
            metadata={"Software": "PORTFOLIO reproducibility/analyze.py"},
        )
        plt.close(figure)

    selected = data["exo"]["selected"]
    figure, axis = plt.subplots(figsize=(8, 6), layout="constrained")
    labels = [
        row["receptor"].split(" / ")[0] + " / " + row["protein"] for row in selected
    ]
    image = axis.imshow(
        [row["ranks"] for row in selected],
        cmap=LinearSegmentedColormap.from_list(
            "rank", ["#83e8d7", "#355977", "#132232"]
        ),
        aspect="auto",
        vmin=1,
        vmax=max(max(row["ranks"]) for row in selected),
    )
    axis.set_yticks(range(len(labels)), labels)
    axis.set_xticks(
        range(5),
        ["Equal", "50/30/20", "50/20/30", "40/35/25", "40/30/30"],
        rotation=30,
        ha="right",
    )
    axis.set_xlabel("Weights for AFS / PRODIGY / STRING (%)")
    axis.set_title("Rank changes under five score weightings", loc="left", pad=18)
    for row, values in enumerate(selected):
        for col, rank in enumerate(values["ranks"]):
            axis.text(
                col,
                row,
                str(int(rank)),
                ha="center",
                va="center",
                color="#08202b" if rank <= 11 else "#ffffff",
            )
    figure.colorbar(
        image, ax=axis, label="Rank among 200 pairs (1 = highest)", fraction=0.035
    )
    save(figure, "exo-rank-sensitivity.png")

    _, chains = structure_coordinates()
    from matplotlib.ticker import MaxNLocator

    figure = plt.figure(figsize=(8, 6.6))
    figure.subplots_adjust(left=0.01, right=0.95, bottom=0.16, top=0.91)
    axis = figure.add_subplot(projection="3d")
    for chain, color, label in [
        ("A", "#83e8d7", "Chain A · CD44"),
        ("B", "#b5a4ef", "Chain B · THBS1"),
    ]:
        coordinates = np.array(chains[chain])
        axis.plot(*coordinates.T, color=color, linewidth=1, label=label)
    all_coordinates = np.array(chains["A"] + chains["B"])
    span = float(np.ptp(all_coordinates, axis=0).max()) / 2
    for dimension, setter in enumerate([axis.set_xlim, axis.set_ylim, axis.set_zlim]):
        center = float(
            (all_coordinates[:, dimension].min() + all_coordinates[:, dimension].max())
            / 2
        )
        setter(center - span, center + span)
    axis.set_box_aspect((1, 1, 1))
    axis.view_init(elev=18, azim=35)
    axis.set_xlabel("x (Å)", labelpad=10)
    axis.set_ylabel("y (Å)", labelpad=10)
    axis.set_zlabel("z (Å)", labelpad=10)
    for dimension in [axis.xaxis, axis.yaxis, axis.zaxis]:
        dimension.set_major_locator(MaxNLocator(4))
    for pane in [axis.xaxis.pane, axis.yaxis.pane, axis.zaxis.pane]:
        pane.fill = False
    axis.grid(False)
    axis.set_title("CD44–THBS1 · predicted Cα trace", loc="left", pad=12)
    figure.legend(
        loc="lower center",
        ncol=2,
        frameon=False,
        labelcolor="#d9eaed",
        bbox_to_anchor=(0.5, 0.02),
    )
    save(figure, "exo-cd44-thbs1.png")

    figure, axis = plt.subplots(figsize=(8, 5.8), layout="constrained")
    rows = data["tag"]
    for column, color, label, marker in [
        ("reference", "#b5a4ef", "Reference glycogen allocation", "o"),
        ("released", "#83e8d7", "Zero glycogen allocation", "s"),
    ]:
        axis.scatter(
            [row["threshold"] for row in rows],
            [row[column] for row in rows],
            color=color,
            label=label,
            marker=marker,
            s=45,
        )
    focus = next(row for row in rows if row["threshold"] == 80)
    axis.annotate(
        "80% demand · +7.96%",
        (80, focus["released"]),
        xytext=(29, 0.047),
        arrowprops={"arrowstyle": "->", "color": "#b5a4ef"},
        color="#d9eaed",
    )
    axis.set(
        xlabel="Matched non-glycogen biomass demand (% of reference)",
        ylabel="Maximum TAG capacity (model flux units)",
        title="iRH783 · reported carbon-allocation scenarios",
        xlim=(-4, 104),
        ylim=(-0.004, 0.11),
    )
    axis.legend(frameon=False, loc="upper right", labelcolor="#d9eaed", fontsize=10)
    axis.grid(axis="y", alpha=0.15)
    save(figure, "fluxnova-tag-demand.png")

    figure, axis = plt.subplots(figsize=(8, 5.8), layout="constrained")
    rows = data["ecoli"]["sweep"]
    axis.scatter(
        [row["threshold"] for row in rows],
        [row["flux"] for row in rows],
        color="#b5a4ef",
        s=55,
    )
    axis.set(
        xlabel="Required growth (% of reported maximum)",
        ylabel="Proinsulin flux (mmol/gDCW/h)",
        title="iHK1487 · reported growth requirements",
        xlim=(15, 105),
        ylim=(-0.003, 0.1),
    )
    axis.annotate(
        "80% · 0.02475 mmol/gDCW/h",
        (80, rows[4]["flux"]),
        xytext=(35, 0.052),
        arrowprops={"arrowstyle": "->", "color": "#83e8d7"},
        color="#d9eaed",
    )
    axis.grid(axis="y", alpha=0.15)
    save(figure, "fluxnova-proinsulin-growth.png")

    # Branded sharing previews use the same authentic plots or plain project text.
    from PIL import Image, ImageDraw, ImageFont

    fonts = Path(matplotlib.get_data_path()) / "fonts" / "ttf"
    heading_font = ImageFont.truetype(str(fonts / "DejaVuSans-Bold.ttf"), 58)
    body_font = ImageFont.truetype(str(fonts / "DejaVuSans.ttf"), 24)
    label_font = ImageFont.truetype(str(fonts / "DejaVuSans.ttf"), 20)
    previews = [
        (
            "exo-target",
            ["EXO-TARGET"],
            ["Receptor–exosomal protein", "prioritization in TNBC"],
            "Predicted structure · computational investigation",
            "exo-cd44-thbs1.png",
        ),
        (
            "fluxnova",
            ["FLUXNOVA"],
            ["Carbon allocation and", "recombinant proinsulin modeling"],
            "Source-reported FBA outputs",
            "fluxnova-tag-demand.png",
        ),
        (
            "bioinformatics-agent-skills",
            ["Bioinformatics", "Agent Skills"],
            ["Executable scientific checks", "and experimental agent workflows"],
            "Research software · evaluation in progress",
            None,
        ),
    ]
    for slug, heading, description, label, filename in previews:
        preview = Image.new("RGB", (1200, 630), "#071522")
        draw = ImageDraw.Draw(preview)
        draw.rectangle((52, 80, 58, 510), fill="#83e8d7")
        draw.text((85, 75), "ABHIGNAN VAJJALA", font=label_font, fill="#bed0d4")
        for i, line in enumerate(heading):
            draw.text((85, 165 + i * 72), line, font=heading_font, fill="#e8f3f3")
        for i, line in enumerate(description):
            draw.text((85, 350 + i * 37), line, font=body_font, fill="#83e8d7")
        draw.text((85, 540), label, font=label_font, fill="#bed0d4")
        if filename:
            thumbnail = Image.open(FIGURES / filename).convert("RGB")
            thumbnail.thumbnail((530, 410), Image.Resampling.LANCZOS)
            preview.paste(thumbnail, (640, 115))
        preview.save(ROOT / "public" / f"og-{slug}.png", optimize=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--check",
        action="store_true",
        help="Verify input hashes and generated numerical results without drawing figures",
    )
    args = parser.parse_args()
    data = collect_results()
    if args.check:
        require(
            json.loads(RESULTS.read_text(encoding="utf-8")) == data,
            "Generated research results are stale",
        )
        print(
            "Source hashes, score formulas, shortlist, weight comparisons and metabolic output arithmetic passed."
        )
        return
    plot_figures(data)
    RESULTS.write_text(
        json.dumps(data, indent=2, ensure_ascii=False, allow_nan=False) + "\n",
        encoding="utf-8",
    )
    print(
        f"Generated four figures and {RESULTS.relative_to(ROOT)} from frozen project outputs."
    )


if __name__ == "__main__":
    main()
