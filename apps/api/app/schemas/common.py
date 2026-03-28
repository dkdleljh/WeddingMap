from pydantic import BaseModel


class ApiResponse(BaseModel):
    success: bool = True
    message: str = "요청이 성공했습니다"
    data: dict | list | None = None
