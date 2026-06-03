from .base import BaseSource, RawContent
from .bbc import BBCSource
from .espn import ESPNSource
from .goal import GoalSource
from .skysports import SkySportsSource

# All active sources. Add RedditSource here later.
ALL_SOURCES: list[BaseSource] = [
    BBCSource(),
    ESPNSource(),
    GoalSource(),
    SkySportsSource(),
]

__all__ = [
    "BaseSource",
    "RawContent",
    "ALL_SOURCES",
    "BBCSource",
    "ESPNSource",
    "GoalSource",
    "SkySportsSource",
]
