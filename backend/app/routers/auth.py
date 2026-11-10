from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random
from app.core.database import get_db
from app.core.security import get_password_hash, create_access_token, get_current_user
from app.core.email import send_password_reset_otp, send_welcome_credentials
from app.models.models import User
from app.schemas.schemas import (
    UserCreate, 
    UserLogin, 
    UserResponse, 
    Token,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    BroadcastCredentialsRequest
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )
    
    user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role="student",
        status="approved",
        department=user_in.department,
        usn=user_in.usn
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    from app.core.security import verify_password

    # Look for existing user
    user = db.query(User).filter(User.email == credentials.email).first()
    
    entered_name = credentials.full_name.strip() if credentials.full_name and credentials.full_name.strip() else None
    entered_usn = credentials.usn.strip() if credentials.usn and credentials.usn.strip() else None
    entered_phone = credentials.phone_number.strip() if credentials.phone_number and credentials.phone_number.strip() else None

    # If user does not exist yet, allow open access for students/faculty with validation
    if not user:
        # SECURITY: Prevent unauthorized admin creation through public login
        if credentials.role == "admin" or "admin@" in credentials.email.lower():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin accounts cannot be self-registered. Please contact GSSSIETW Administration."
            )

        if not entered_name:
            name_part = credentials.email.split("@")[0].replace(".", " ").replace("_", " ").title()
            entered_name = name_part if name_part else "Student"

        # Explicit role from payload or inferred from email (restricted to student or faculty)
        role = "faculty" if credentials.role == "faculty" or "faculty" in credentials.email.lower() else "student"

        # Determine USN / Phone based on role
        if role == "faculty":
            final_phone = entered_phone or entered_usn or None
            final_usn = final_phone or "FAC-ECE"
        else:
            final_phone = entered_phone or None
            final_usn = entered_usn or ("4GW22EC" + str(abs(hash(credentials.email)) % 900 + 100))

        user = User(
            email=credentials.email,
            hashed_password=get_password_hash(credentials.password or "student123"),
            full_name=entered_name,
            role=role,
            status="approved",
            department="Electronics & Communication Engineering",
            usn=final_usn,
            phone_number=final_phone,
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        # SECURITY: For existing users, verify entered password against stored salted hash
        if credentials.password:
            if not verify_password(credentials.password, user.hashed_password):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid credentials. Please verify your password."
                )

        # Update name or credentials dynamically if provided
        changed = False
        if entered_name and user.full_name != entered_name:
            user.full_name = entered_name
            changed = True
        
        # Update USN for student or Phone Number for faculty
        if user.role == "faculty" and (entered_phone or entered_usn):
            p = entered_phone or entered_usn
            user.phone_number = p
            user.usn = p
            changed = True
        elif user.role == "student" and entered_usn:
            user.usn = entered_usn
            changed = True
        elif user.role == "admin" and (entered_usn or entered_phone):
            user.usn = entered_usn or entered_phone
            changed = True

        if changed:
            db.commit()
            db.refresh(user)
        
    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/users")
def get_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    # Only return students and faculty for approval/governance in the portal (admin accounts stay in database but excluded here)
    users = db.query(User).filter(User.role.in_(["student", "faculty"])).order_by(User.created_at.desc()).all()
    return [
        {
            "id": u.id,
            "name": u.full_name,
            "email": u.email,
            "role": u.role,
            "status": u.status,
            "usn": u.phone_number if (u.role == "faculty" and u.phone_number) else (u.usn or "—"),
            "phone_number": u.phone_number,
            "department": u.department,
            "created_at": u.created_at
        }
        for u in users
    ]

@router.patch("/users/{user_id}")
def update_user_status(
    user_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    u = db.query(User).filter(User.id == user_id).first()
    if not u:
        raise HTTPException(status_code=404, detail="User not found")
    if "status" in payload:
        u.status = payload["status"]
    if "role" in payload:
        u.role = payload["role"]
    db.commit()
    db.refresh(u)
    return {"message": "User updated successfully", "id": u.id, "status": u.status, "role": u.role}

@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    u = db.query(User).filter(User.id == user_id).first()
    if not u:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(u)
    db.commit()
    return {"message": "User deleted successfully"}

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    ident = req.email_or_usn.strip().lower()
    user = db.query(User).filter(
        (User.email.ilike(ident)) | (User.usn.ilike(ident)) | (User.phone_number.ilike(ident))
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="No account found matching this Email or USN."
        )

    # Generate 6-digit random code
    code = f"{random.randint(100000, 999999)}"
    user.reset_code = code
    user.reset_code_expires_at = datetime.utcnow() + timedelta(minutes=15)
    db.commit()

    # Mask email for privacy (e.g. ra***@gmail.com)
    parts = user.email.split("@")
    masked_name = parts[0][:2] + "***" if len(parts[0]) > 2 else parts[0] + "***"
    masked_email = f"{masked_name}@{parts[1]}" if len(parts) > 1 else user.email

    # Send OTP email
    send_password_reset_otp(user.email, user.full_name, code)

    return {
        "message": f"Verification code sent to {masked_email}",
        "masked_email": masked_email,
        "email": user.email
    }

@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    ident = req.email_or_usn.strip().lower()
    user = db.query(User).filter(
        (User.email.ilike(ident)) | (User.usn.ilike(ident)) | (User.phone_number.ilike(ident))
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Account not found."
        )

    if not user.reset_code or user.reset_code.strip() != req.reset_code.strip():
        raise HTTPException(
            status_code=400,
            detail="Invalid verification code. Please check your email."
        )

    if user.reset_code_expires_at and datetime.utcnow() > user.reset_code_expires_at:
        raise HTTPException(
            status_code=400,
            detail="Verification code has expired. Please request a new code."
        )

    if len(req.new_password.strip()) < 4:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 4 characters."
        )

    user.hashed_password = get_password_hash(req.new_password)
    user.reset_code = None
    user.reset_code_expires_at = None
    db.commit()

    return {"message": "Password updated successfully. You can now log in."}

@router.post("/broadcast-credentials")
def broadcast_credentials(
    req: BroadcastCredentialsRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Broadcasts welcome emails with default credentials to users.
    Only admin or faculty can trigger this batch broadcast.
    """
    if current_user.role not in ["admin", "faculty"]:
        raise HTTPException(status_code=403, detail="Admin or Faculty authorization required")

    query = db.query(User).filter(User.is_active == True)
    if req.target_role:
        query = query.filter(User.role == req.target_role)
    else:
        query = query.filter(User.role.in_(["student", "faculty"]))

    users = query.all()
    default_pwd = req.default_password or "GsssGate@2026"
    dispatched_count = 0

    for u in users:
        identifier = u.phone_number if u.role == "faculty" and u.phone_number else (u.usn or u.email)
        # Update user's password to the default if desired
        u.hashed_password = get_password_hash(default_pwd)
        success = send_welcome_credentials(
            to_email=u.email,
            full_name=u.full_name,
            role=u.role,
            identifier=identifier,
            default_password=default_pwd
        )
        if success:
            dispatched_count += 1

    db.commit()
    return {
        "message": f"Successfully sent credentials to {dispatched_count} user accounts.",
        "total_targeted": len(users),
        "dispatched": dispatched_count,
        "default_password": default_pwd
    }


