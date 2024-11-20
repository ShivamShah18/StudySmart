from .timer import timer_blueprint
from .detection import detection_blueprint
from .video import video_blueprint
from .graph import graph_blueprint

# Expose the blueprints to the outside
__all__ = [
    "timer_blueprint",
    "detection_blueprint",
    "video_blueprint",
    "graph_blueprint"
]
