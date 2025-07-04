import random
import re
from .database import Base, engine, get_db
from . import models, schemas, crud, ai
from sqlalchemy.orm import Session
from sqlalchemy import text

continents = {
    "Africa": {
        "East Africa": ["Kenya", "Tanzania", "Uganda"],
        "Southern Africa": ["Botswana", "eSwatini", "Lesotho", "Malawi", "Mozambique", "Namibia", "South Africa", "Zambia", "Zimbabwe"],
        "West Africa": ["Angola", "Côte d'Ivoire", "Ghana", "Nigeria", "South Sudan"]
    },
    "Isle of Man": {},
    "Jersey": {}
}
segments = [
    "Consumer & Community Banking",
    "Corporate & Investment Bank",
    "Commercial Banking",
    "Asset Management"
]
business_unit_names = [
    "Business Unit A", "Business Unit B", "Business Unit C", "Business Unit D", "Business Unit E"
]
usernames = ["alice", "bob", "carol", "dave", "eve", "frank", "grace", "heidi", "ivan", "judy"]
risk_types = ["third_party", "change", "incident", "regulatory", "operational"]
risk_statuses = ["open", "closed", "in progress"]
action_statuses = ["open", "closed", "pending"]

def sanitize_email_country(country):
    # Remove non-ASCII, replace spaces and apostrophes
    country_ascii = re.sub(r"[^a-zA-Z0-9]", "", country)
    return country_ascii.lower()

# Helper to generate AI or fallback text
def ai_or_template(prompt, fallback):
    try:
        result = ai.get_insight(prompt)
        if result and isinstance(result, str):
            return result.strip()
    except Exception:
        pass
    return fallback

def seed():
    Base.metadata.create_all(bind=engine)
    db: Session = next(get_db())
    # Delete all existing data in FK order
    db.query(models.ActionItem).delete()
    db.query(models.Risk).delete()
    db.query(models.User).delete()
    db.query(models.Node).delete()
    db.commit()
    # Reset sequences (PostgreSQL only)
    for table in ["action_items", "risks", "users", "nodes"]:
        try:
            db.execute(text(f"ALTER SEQUENCE {table}_id_seq RESTART WITH 1"))
        except Exception:
            pass  # Ignore if not PostgreSQL
    db.commit()
    # Root node
    root = crud.create_node(db, schemas.NodeCreate(name="Root", parent_id=None, level=1))
    # Continents and countries
    for region, subregions in continents.items():
        region_node = crud.create_node(db, schemas.NodeCreate(name=region, parent_id=root.id, level=2))
        if subregions:
            for subregion, countries in subregions.items():
                subregion_node = crud.create_node(db, schemas.NodeCreate(name=subregion, parent_id=region_node.id, level=3))
                for country in countries:
                    country_node = crud.create_node(db, schemas.NodeCreate(name=country, parent_id=subregion_node.id, level=4))
                    # Segments
                    for segment in segments:
                        segment_node = crud.create_node(db, schemas.NodeCreate(name=segment, parent_id=country_node.id, level=5))
                        # Business Units
                        bu_count = random.randint(3, 5)
                        for i in range(bu_count):
                            bu_name = f"{random.choice(business_unit_names)} {i+1}"
                            bu_node = crud.create_node(db, schemas.NodeCreate(name=bu_name, parent_id=segment_node.id, level=6))
                            # Users
                            user_count = random.randint(1, 3)
                            for u in range(user_count):
                                uname = f"{random.choice(usernames)}{random.randint(1,99)}"
                                email_country = sanitize_email_country(country)
                                email = f"{uname.lower()}@{email_country}.testbank.com"
                                if not db.query(models.User).filter(models.User.username == uname).first():
                                    user_create = schemas.UserCreate(
                                        username=uname,
                                        email=email,
                                        password="P@ssw0rd",
                                        node_id=bu_node.id,
                                        level=6
                                    )
                                    crud.create_user(db, user_create)
                            # Risks
                            risk_count = random.randint(2, 5)
                            for r in range(risk_count):
                                rtype = random.choice(risk_types)
                                rstatus = random.choice(risk_statuses)
                                rtitle = ai_or_template(
                                    f"Generate a short risk title for a {rtype} risk in {bu_name}, {segment}, {country}",
                                    f"{rtype.title()} Risk {r+1}"
                                )
                                rdesc = ai_or_template(
                                    f"Describe a {rtype} risk for {bu_name} in {segment}, {country}",
                                    f"Sample description for {rtype} risk in {bu_name}, {segment}, {country}."
                                )
                                risk_create = schemas.RiskCreate(
                                    title=rtitle,
                                    description=rdesc,
                                    node_id=bu_node.id,
                                    risk_type=rtype,
                                    status=rstatus
                                )
                                risk = crud.create_risk(db, risk_create)
                                # Action Items
                                action_count = random.randint(1, 2)
                                for a in range(action_count):
                                    adesc = ai_or_template(
                                        f"Suggest an action item for risk '{rtitle}' in {bu_name}, {segment}, {country}",
                                        f"Action item {a+1} for {rtitle} in {bu_name}, {segment}, {country}."
                                    )
                                    astatus = random.choice(action_statuses)
                                    assigned_users = db.query(models.User).filter(models.User.node_id == bu_node.id).all()
                                    assigned_to = assigned_users[0].id if assigned_users else None
                                    if assigned_to:
                                        action_create = schemas.ActionItemCreate(
                                            description=adesc,
                                            risk_id=risk.id,
                                            assigned_to=assigned_to,
                                            status=astatus
                                        )
                                        crud.create_action_item(db, action_create)
    # Isle of Man and Jersey (no subregions)
    for country in ["Isle of Man", "Jersey"]:
        country_node = crud.create_node(db, schemas.NodeCreate(name=country, parent_id=root.id, level=2))
        for segment in segments:
            segment_node = crud.create_node(db, schemas.NodeCreate(name=segment, parent_id=country_node.id, level=3))
            bu_count = random.randint(3, 5)
            for i in range(bu_count):
                bu_name = f"{random.choice(business_unit_names)} {i+1}"
                bu_node = crud.create_node(db, schemas.NodeCreate(name=bu_name, parent_id=segment_node.id, level=4))
                # Users
                user_count = random.randint(1, 3)
                for u in range(user_count):
                    uname = f"{random.choice(usernames)}{random.randint(1,99)}"
                    email_country = sanitize_email_country(country)
                    email = f"{uname.lower()}@{email_country}.testbank.com"
                    if not db.query(models.User).filter(models.User.username == uname).first():
                        user_create = schemas.UserCreate(
                            username=uname,
                            email=email,
                            password="P@ssw0rd",
                            node_id=bu_node.id,
                            level=4
                        )
                        crud.create_user(db, user_create)
                # Risks
                risk_count = random.randint(2, 5)
                for r in range(risk_count):
                    rtype = random.choice(risk_types)
                    rstatus = random.choice(risk_statuses)
                    rtitle = ai_or_template(
                        f"Generate a short risk title for a {rtype} risk in {bu_name}, {segment}, {country}",
                        f"{rtype.title()} Risk {r+1}"
                    )
                    rdesc = ai_or_template(
                        f"Describe a {rtype} risk for {bu_name} in {segment}, {country}",
                        f"Sample description for {rtype} risk in {bu_name}, {segment}, {country}."
                    )
                    risk_create = schemas.RiskCreate(
                        title=rtitle,
                        description=rdesc,
                        node_id=bu_node.id,
                        risk_type=rtype,
                        status=rstatus
                    )
                    risk = crud.create_risk(db, risk_create)
                    # Action Items
                    action_count = random.randint(1, 2)
                    for a in range(action_count):
                        adesc = ai_or_template(
                            f"Suggest an action item for risk '{rtitle}' in {bu_name}, {segment}, {country}",
                            f"Action item {a+1} for {rtitle} in {bu_name}, {segment}, {country}."
                        )
                        astatus = random.choice(action_statuses)
                        assigned_users = db.query(models.User).filter(models.User.node_id == bu_node.id).all()
                        assigned_to = assigned_users[0].id if assigned_users else None
                        if assigned_to:
                            action_create = schemas.ActionItemCreate(
                                description=adesc,
                                risk_id=risk.id,
                                assigned_to=assigned_to,
                                status=astatus
                            )
                            crud.create_action_item(db, action_create)
    db.close()
    print("Seeding complete. Database reset and populated with a rich hierarchy of nodes, users, risks, and actions!")

if __name__ == "__main__":
    seed() 