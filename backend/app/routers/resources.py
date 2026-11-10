from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from pathlib import Path
from app.core.database import get_db
from app.models.models import Resource, Subject, User
from app.schemas.schemas import ResourceResponse
from app.core.security import get_current_user, require_role

router = APIRouter(prefix="/resources", tags=["Study Resources & Library"])

@router.get("", response_model=List[ResourceResponse])
def get_resources(
    subject_id: Optional[int] = None,
    resource_type: Optional[str] = None,
    downloadable_only: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Resource).filter(Resource.status == "published")
    if subject_id:
        query = query.filter(Resource.subject_id == subject_id)
    if resource_type and resource_type != "All":
        query = query.filter(Resource.resource_type == resource_type)
    if downloadable_only:
        query = query.filter(Resource.is_downloadable == True)
        
    resources = query.order_by(Resource.created_at.desc()).all()
    results = []
    for r in resources:
        item = ResourceResponse.from_orm(r)
        if r.subject:
            item.subject_name = r.subject.name
        results.append(item)
    return results

@router.post("/upload", response_model=ResourceResponse)
async def upload_resource(
    title: str = Form(...),
    resource_type: str = Form(...),
    subject_id: int = Form(...),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["faculty", "admin"]))
):
    author = current_user.full_name or "Faculty Member"
    file_url = f"/resources/{title.lower().replace(' ', '_')}.pdf"
    file_size_mb = 2.5

    ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx", ".ppt", ".pptx", ".txt"}
    MAX_FILE_SIZE = 25 * 1024 * 1024  # 25 MB max

    if file and file.filename:
        ext = Path(file.filename).suffix.lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type '{ext}'. Only academic documents ({', '.join(ALLOWED_EXTENSIONS)}) are allowed."
            )
        try:
            public_dir = Path(__file__).resolve().parent.parent.parent.parent / "frontend" / "public" / "resources"
            public_dir.mkdir(parents=True, exist_ok=True)
            safe_name = f"{int(datetime.utcnow().timestamp())}_{file.filename.replace(' ', '_')}"
            dest_path = public_dir / safe_name
            contents = await file.read()
            if len(contents) > MAX_FILE_SIZE:
                raise HTTPException(status_code=400, detail="File size exceeds the 25 MB limit.")
            with open(dest_path, "wb") as f:
                f.write(contents)
            file_url = f"/resources/{safe_name}"
            file_size_mb = max(0.1, round(len(contents) / (1024 * 1024), 2))
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail="Error uploading file to storage.")

    res = Resource(
        title=title,
        resource_type=resource_type,
        subject_id=subject_id,
        author_name=author,
        file_url=file_url,
        file_size_mb=file_size_mb,
        status="published"
    )
    db.add(res)
    db.commit()
    db.refresh(res)
    return res
