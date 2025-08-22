from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from starlette import status


class AppError(Exception):
    def __init__(self, message: str, status_code: int = status.HTTP_400_BAD_REQUEST) -> None:
        self.message = message
        self.status_code = status_code
        super().__init__(message)


def add_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(AppError)
    async def app_error_handler(_: Request, exc: AppError):
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.message})

    @app.exception_handler(404)
    async def not_found_handler(_: Request, __):
        return JSONResponse(status_code=404, content={"detail": "Not Found"})

