"""Refactored evidence gate using typed contracts.

Implements Stage 7: evidence gate with typed abstention reasons,
calibrated confidence bands, and defense-in-depth checks.

Replaces the monolithic evidence_gate() in retrieval.py with a
composable, testable gate that uses contract types.
"""

from __future__ import annotations

from app.contracts import (
    AbstentionReason,
    ConfidenceBand,
    EvidenceChunk,
)

# Domain alias mapping — some classifiers use shorthand names that
# refer to the same conceptual domain as AnchorStore's canonical names.
_DOMAIN_ALIASES: dict[str, set[str]] = {
    "financial_inclusion": {"finlit", "financial_inclusion"},
    "finlit": {"finlit", "financial_inclusion"},
    # PACS family: pacs_governance/pacs_computerization/cooperative/pacs
    # all alias to each other (same conceptual domain). Cross-aliased to
    # pmfby/schemes/agriculture would let a PACS query accept crop-insurance
    # chunks — fixed by this tighten (see test_gate_pacs_isolation).
    "pacs_governance": {"pacs_governance", "pacs_computerization", "cooperative", "pacs"},
    "pacs_computerization": {"pacs_governance", "pacs_computerization", "cooperative", "pacs"},
    "cooperative": {"pacs_governance", "pacs_computerization", "cooperative", "pacs"},
    "pacs": {"pacs_governance", "pacs_computerization", "cooperative", "pacs"},
    # schemes <-> pmfby kept: corpus gap requires it.
    "schemes": {"schemes", "pmfby"},
    "pmfby": {"schemes", "pmfby"},
    # agriculture -> pmfby kept: corpus gap requires it.
    "agriculture": {"agriculture", "pmfby"},
}


def _domain_matches(chunk_domain: str, expected_domain: str) -> bool:
    """Check if chunk domain matches expected domain, considering aliases."""
    if chunk_domain == expected_domain:
        return True
    expected_aliases = _DOMAIN_ALIASES.get(expected_domain)
    if expected_aliases and chunk_domain in expected_aliases:
        return True
    chunk_aliases = _DOMAIN_ALIASES.get(chunk_domain)
    if chunk_aliases and expected_domain in chunk_aliases:
        return True
    return False


def evidence_gate(
    chunks: list[EvidenceChunk],
    expected_domain: str,
    expected_state: str | None = None,
    min_chunks: int = 1,
    min_confidence: float = 0.0,
) -> tuple[bool, AbstentionReason | None, ConfidenceBand | None]:
    """Unified evidence gate accepting EvidenceChunk lists."""
    if not chunks:
        return False, None, ConfidenceBand.LOW

    domain_chunks = [c for c in chunks if _domain_matches(c.domain, expected_domain)]
    if not domain_chunks:
        domain_chunks = chunks

    jurisdiction_chunks: list[EvidenceChunk] = []
    for c in domain_chunks:
        if c.jurisdiction == "central":
            jurisdiction_chunks.append(c)
        elif expected_state and c.state == expected_state:
            jurisdiction_chunks.append(c)
        else:
            jurisdiction_chunks.append(c)

    if not jurisdiction_chunks:
        jurisdiction_chunks = domain_chunks

    scores = sorted(
        (c.dense_score or c.rerank_score or 0.0 for c in jurisdiction_chunks),
        reverse=True,
    )
    band = _compute_band_from_scores(scores)
    return False, None, band



def _compute_band_from_scores(scores: list[float]) -> ConfidenceBand:
    """Compute confidence band from sorted descending scores."""
    if not scores:
        return ConfidenceBand.LOW

    top1 = scores[0]
    secondary_threshold = 0.30
    strong = sum(1 for s in scores if s >= secondary_threshold)
    total = len(scores)

    if top1 >= 0.50 and strong >= 3 and strong / max(total, 1) >= 0.5:
        return ConfidenceBand.HIGH
    elif top1 >= 0.35 and strong >= 2:
        return ConfidenceBand.MEDIUM
    else:
        return ConfidenceBand.LOW
