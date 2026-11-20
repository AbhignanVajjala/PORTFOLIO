import { useId } from "react";
import { rankFigure, type ResearchFigure as FigureData } from "./data";
import results from "./research-results.json";

export function ResearchFigure({
  figure,
  headingLevel = 3,
}: {
  figure: FigureData;
  headingLevel?: 2 | 3;
}) {
  const label = useId();
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <figure className="research-figure">
      <Heading id={label}>{figure.title}</Heading>
      <div
        className="figure-scroll"
        role="region"
        aria-labelledby={label}
        tabIndex={0}
      >
        <img
          src={figure.image}
          alt={figure.alt}
          width={figure.width}
          height={figure.height}
          loading="lazy"
          decoding="async"
        />
      </div>
      <figcaption>
        <p>{figure.interpretation}</p>
        <span className="figure-mobile-hint">
          Scroll the figure to read all labels.
        </span>
        <a href={figure.sourceUrl} target="_blank" rel="noopener noreferrer">
          {figure.sourceLabel}
        </a>
        {" · "}
        <a href={figure.image} target="_blank" rel="noopener noreferrer">
          Full-size figure
        </a>
      </figcaption>
    </figure>
  );
}

export function RankingEvidence() {
  const correlations = results.exo.weightComparisons.map((row) => row.spearman);
  const overlaps = results.exo.weightComparisons.map((row) => row.top10Overlap);
  return (
    <div className="ranking-evidence">
      <p>
        Recalculated Spearman rank correlation with equal weights ranges from{" "}
        {Math.min(...correlations).toFixed(3)} to{" "}
        {Math.max(...correlations).toFixed(3)} across four alternatives. Between{" "}
        {Math.min(...overlaps)} and {Math.max(...overlaps)} of the ten
        highest-ranked pairs are retained. This comparison uses all 200 pairs,
        before shortlist filtering.
      </p>
      <ResearchFigure figure={rankFigure} />
      <div
        className="table-scroll"
        role="region"
        aria-label="Selected shortlist data"
        tabIndex={0}
      >
        <table>
          <caption>
            Selected shortlist entries · priority scores are dimensionless
          </caption>
          <thead>
            <tr>
              <th scope="col">Shortlist rank</th>
              <th scope="col">Receptor / candidate</th>
              <th scope="col">Score</th>
              <th scope="col">Coverage</th>
              <th scope="col">Feasibility</th>
            </tr>
          </thead>
          <tbody>
            {results.exo.selected.map((row) => (
              <tr key={`${row.receptor}-${row.protein}`}>
                <td>{row.shortlistRank}</td>
                <th scope="row">
                  {row.receptor.split(" / ")[0]} / {row.protein}
                </th>
                <td>{row.score.toFixed(3)}</td>
                <td>{row.coverage}</td>
                <td>{row.feasibility}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="figure-source">
        The αvβ3 entries share subunit-derived STRING evidence. A high score
        expresses computational priority for follow-up.{" "}
        <a
          href={`${results.sources.tnbc.repository}/blob/${results.sources.tnbc.commit}/outputs/final_preferred_shortlist.csv`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Source shortlist
        </a>
      </p>
    </div>
  );
}
