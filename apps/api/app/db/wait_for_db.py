import time

from sqlalchemy import text

from app.db.session import engine

for _ in range(30):
    try:
        with engine.connect() as connection:
            connection.execute(text("select 1"))
        print("데이터베이스 연결 성공")
        break
    except Exception:
        print("데이터베이스 대기 중")
        time.sleep(2)
else:
    raise SystemExit("데이터베이스 연결 실패")
