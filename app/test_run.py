# run_tests.py

import pytest
from app import create_app

@pytest.fixture
def app():
    """Fixture pour créer une instance de l'application Flask."""
    return create_app("config.DevelopmentConfig")

def test_app_creation(app):
    """Test si l'application Flask est créée avec succès."""
    assert app is not None
    assert app.config["DEBUG"] is True
    assert app.config["ENV"] == "development"
