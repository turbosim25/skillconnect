# EC2 Setup for Backend
1. Launch EC2 (Ubuntu) in free tier.
2. Install Python 3.10+, `pip install fastapi uvicorn`.
3. Upload your code and run:
   `uvicorn main:app --host 0.0.0.0 --port 8000`
4. Open port 8000 in EC2 security group.
