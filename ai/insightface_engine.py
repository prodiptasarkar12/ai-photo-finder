"""InsightFace adapter for development/evaluation.

Model pack: buffalo_l (SCRFD detector + ResNet50 recognition, 512-D embeddings).
IMPORTANT: InsightFace's public pretrained model packs are non-commercial research
only. Do not enable this adapter for paid/customer production until the model
license is obtained or a commercially licensed replacement is configured.
"""
import numpy as np
import insightface
from insightface.app import FaceAnalysis

class InsightFaceEngine:
    def __init__(self, model_name="buffalo_l", providers=None, det_size=(640, 640)):
        providers = providers or ["CPUExecutionProvider"]
        self.app = FaceAnalysis(name=model_name, providers=providers)
        self.app.prepare(ctx_id=0, det_size=det_size)

    def process(self, image_bgr):
        faces = self.app.get(image_bgr)
        results = []
        for index, face in enumerate(faces):
            embedding = np.asarray(face.embedding, dtype=np.float32)
            norm = np.linalg.norm(embedding)
            if norm == 0:
                continue
            embedding = (embedding / norm).tolist()
            results.append({
                "index": index,
                "bbox": [float(x) for x in face.bbox.tolist()],
                "embedding": embedding,
                "det_score": float(face.det_score),
            })
        return results
