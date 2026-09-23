import re
from typing import List, Dict, Tuple
from collections import Counter

# Standard English stopwords
STOPWORDS = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't",
    "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can't",
    "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during",
    "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he",
    "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's",
    "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's",
    "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or",
    "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd", "she'll",
    "she's", "should", "shouldn't", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them",
    "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this",
    "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're",
    "we've", "were", "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who",
    "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're",
    "you've", "your", "yours", "yourself", "yourselves", "will", "just", "also", "get", "like", "one", "can",
    "use", "view", "click", "page", "site", "web", "us", "see", "sign", "free", "privacy", "terms", "policy"
}

def clean_text(text: str) -> str:
    """Removes extra whitespaces, newlines, and non-printable characters."""
    if not text:
        return ""
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def tokenize(text: str) -> List[str]:
    """Tokenizes text into alphanumeric lowercase tokens."""
    if not text:
        return []
    words = re.findall(r'\b[a-zA-Z0-9_\-\']+\b', text.lower())
    return [w.strip("'").strip("-") for w in words if len(w) > 1]

def count_syllables(word: str) -> int:
    """Heuristic syllable count for English words."""
    word = word.lower()
    if len(word) <= 3:
        return 1
    word = re.sub(r'(?:[^laeiouy]|ed|es|e)$', '', word)
    word = re.sub(r'^y', '', word)
    syllables = len(re.findall(r'[aeiouy]{1,2}', word))
    return max(1, syllables)

def calculate_reading_ease(text: str, total_words: int, total_sentences: int) -> Tuple[float, str]:
    """
    Computes Flesch Reading Ease score:
    206.835 - 1.015 * (total words / total sentences) - 84.6 * (total syllables / total words)
    """
    if total_words <= 0 or total_sentences <= 0:
        return 0.0, "N/A"

    words = tokenize(text)
    if not words:
        return 0.0, "N/A"

    total_syllables = sum(count_syllables(w) for w in words)
    asl = total_words / total_sentences # Average Sentence Length
    asw = total_syllables / total_words # Average Syllables per Word

    score = 206.835 - (1.015 * asl) - (84.6 * asw)
    score = max(0.0, min(100.0, round(score, 1)))

    if score >= 90:
        level = "Very Easy (5th grade)"
    elif score >= 80:
        level = "Easy (6th grade)"
    elif score >= 70:
        level = "Fairly Easy (7th grade)"
    elif score >= 60:
        level = "Standard (8th-9th grade)"
    elif score >= 50:
        level = "Fairly Difficult (10th-12th grade)"
    elif score >= 30:
        level = "Difficult (College)"
    else:
        level = "Very Confusing / Academic"

    return score, level

def extract_ngrams(words: List[str], n: int) -> List[str]:
    """Extracts n-grams from a word list, filtering out stopwords from single-word tokens."""
    if len(words) < n:
        return []
    
    ngrams = []
    for i in range(len(words) - n + 1):
        gram_words = words[i:i + n]
        # For 1-grams, skip stopwords
        if n == 1:
            if gram_words[0] in STOPWORDS or len(gram_words[0]) < 3 or gram_words[0].isnumeric():
                continue
            ngrams.append(gram_words[0])
        else:
            # For 2 and 3 grams, make sure at least one word is not a stopword and first/last aren't pure stopwords
            if gram_words[0] in STOPWORDS and gram_words[-1] in STOPWORDS:
                continue
            if all(w in STOPWORDS for w in gram_words):
                continue
            ngrams.append(" ".join(gram_words))
    return ngrams
