"""Phase 3 AI engine contract.

Optional runtime dependencies are intentionally isolated here so the web API can
start without a heavyweight ML stack. Install a supported detector/embedder in
production and implement detect_faces()/embed_face() with the selected model.
"""
from dataclasses import dataclass
from typing import Any

@dataclass
class DetectedFace:
    index: int
    bbox: tuple[int, int, int, int]
    embedding: list[float]

class FaceEngine:
    def __init__(self, model_name: str = "production-model"):
        self.model_name = model_name

    def detect_faces(self, image: Any) -> list[tuple[int, int, int, int]]:
        raise NotImplementedError("Install and configure the production face detector")

    def embed_face(self, image: Any, bbox: tuple[int, int, int, int]) -> list[float]:
        raise NotImplementedError("Install and configure the production face embedding model")

    def process(self, image: Any) -> list[DetectedFace]:
        faces = self.detect_faces(image)
        return [DetectedFace(i, box, self.embed_face(image, box)) for i, box in enumerate(faces)]
