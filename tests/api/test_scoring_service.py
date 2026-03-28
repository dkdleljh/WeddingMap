from app.services.scoring import calculate_overall_score, review_confidence


def test_scoring_returns_weighted_score():
    confidence = review_confidence(20, 0.8)
    score = calculate_overall_score(80, 90, 70, 60, 85, 75, confidence)
    assert round(score, 2) > 0
    assert confidence > 0
