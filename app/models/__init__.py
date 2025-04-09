# app/models/__init__.py

from app import db  # ✅ Correction de l'import

# Import des modèles dans le bon ordre pour éviter les erreurs circulaires
from .base_model import BaseModel
from .user import User
from .place import Place
from .review import Review
from .amenity import Amenity  # ✅ Ajout si l'amenity est aussi un modèle